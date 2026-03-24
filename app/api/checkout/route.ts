import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, table, totalAmount, paymentMethod, ovoPhone, items } = body;

    const orderId = `ORD-${Date.now()}`;
    
    // OFFLINE PAYMENT (Kasir Murni)
    if (paymentMethod === 'kasir') {
      await prisma.order.create({
        data: {
          orderNumber: orderId,
          customerName: name,
          tableNumber: table,
          totalAmount: Math.round(totalAmount),
          paymentMethod: 'kasir',
          paymentStatus: 'PENDING',
          items: {
            create: items.map((item: any) => ({
              menuItemId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
      return NextResponse.json({ success: true, orderId });
    }

    // ONLINE PAYMENT (Midtrans Core API Switch)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    if (!serverKey) return NextResponse.json({ error: "Server belum dikonfigurasi dengan MIDTRANS_SERVER_KEY" }, { status: 500 });

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const coreApiUrl = isProduction 
      ? "https://api.midtrans.com/v2/charge"
      : "https://api.sandbox.midtrans.com/v2/charge";

    const authBase64 = Buffer.from(serverKey + ':').toString('base64');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any = {
      payment_type: "qris", // Default
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalAmount),
      },
      customer_details: { first_name: name.substring(0, 50) }
    };

    if (paymentMethod === 'midtrans_va') {
      payload.payment_type = 'bank_transfer';
      payload.bank_transfer = { bank: 'bca' };
    } else if (paymentMethod === 'midtrans_gopay') {
      payload.payment_type = 'gopay';
    } else if (paymentMethod === 'midtrans_dana') {
      payload.payment_type = 'dana';
    } else if (paymentMethod === 'midtrans_ovo') {
      payload.payment_type = 'ovo';
      payload.ovo = { phone: ovoPhone || "08123456789" };
    } else if (paymentMethod === 'midtrans_qris') {
      payload.payment_type = 'qris';
    }

    const response = await fetch(coreApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${authBase64}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok && data.status_code !== "201" && data.status_code !== "200") {
      throw new Error(data.status_message || JSON.stringify(data));
    }
    
    let qrUrl = null;
    let vaNumber = null;
    let bankName = null;
    let deepLinkUrl = null;

    if (data.actions) {
      if (payload.payment_type === 'gopay') {
         const dl = data.actions.find((a: any) => a.name === 'deeplink-redirect');
         if (dl) deepLinkUrl = dl.url;
         
         const qr = data.actions.find((a: any) => a.name === 'generate-qr-code');
         if (qr) qrUrl = qr.url;
      } else if (payload.payment_type === 'dana') {
         const dp = data.actions.find((a: any) => a.name === 'deposit' || a.name === 'redirect');
         deepLinkUrl = dp ? dp.url : data.actions[0]?.url;
      } else if (payload.payment_type === 'qris') {
         const qrAction = data.actions.find((a: any) => a.name === 'generate-qr-code');
         if (qrAction) qrUrl = qrAction.url;
      }
    }
    
    if (payload.payment_type === 'dana' && data.redirect_url) {
      deepLinkUrl = data.redirect_url;
    }

    if (data.va_numbers && data.va_numbers.length > 0) {
      vaNumber = data.va_numbers[0].va_number;
      bankName = data.va_numbers[0].bank;
    }

    // SIMPAN PERMANEN ORDER KE DATABASE KITA AGAR TAMPIL DI KASIR
    await prisma.order.create({
      data: {
        orderNumber: orderId,
        customerName: name,
        tableNumber: table,
        totalAmount: Math.round(totalAmount),
        paymentMethod: paymentMethod,
        paymentStatus: 'PENDING',
        qrUrl: qrUrl,
        deepLinkUrl: deepLinkUrl,
        vaNumber: vaNumber,
        bankName: bankName,
        isPush: payload.payment_type === 'ovo',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId, qrUrl, vaNumber, bankName, deepLinkUrl, isPush: payload.payment_type === 'ovo' });

  } catch (error: any) {
    console.error("DB Process Transaction Failed:", error);
    return NextResponse.json({ error: error.message || "Failed to process Database Persistence" }, { status: 500 });
  }
}
