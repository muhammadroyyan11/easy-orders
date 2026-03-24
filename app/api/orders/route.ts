import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

async function autoSyncMidtrans(orders: any[]) {
  const pendingMidtrans = orders.filter(o => o.paymentStatus === 'PENDING' && o.paymentMethod.startsWith('midtrans_'));
  
  if (pendingMidtrans.length === 0) return orders;

  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  if (!serverKey) return orders;

  const encodedKey = Buffer.from(serverKey + ':').toString('base64');
  let hasUpdates = false;

  await Promise.all(pendingMidtrans.map(async (order) => {
    try {
      const midtransOrderId = order.orderNumber || order.id;
      const res = await fetch(`https://api.sandbox.midtrans.com/v2/${midtransOrderId}/status`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${encodedKey}`
        }
      });
      const data = await res.json();
      
      if (data.transaction_status === 'settlement' || data.transaction_status === 'capture') {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'PAID' }
        });
        hasUpdates = true;
      }
    } catch (e) {}
  }));

  if (hasUpdates) {
    return await prisma.order.findMany({
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  return orders;
}

export async function GET() {
  try {
    let orders = await prisma.order.findMany({
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' }
    });
    
    // Fitur Super: Localhost Auto-Polling pengganti Webhook!
    orders = await autoSyncMidtrans(orders);

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch active orders list" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, paymentStatus, orderStatus } = body;
    if (!id) return NextResponse.json({ error: "Missing Order ID" }, { status: 400 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (orderStatus) data.orderStatus = orderStatus;

    const updated = await prisma.order.update({
      where: { id },
      data
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal update status pesanan" }, { status: 500 });
  }
}
