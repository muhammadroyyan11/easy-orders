import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';

export async function GET() {
  try {
    const branchId = await getCurrentBranchId();
    const data = await prisma.purchaseOrder.findMany({
      where: { branchId },
      include: { items: { include: { rawMaterial: true } } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const { supplierName, invoiceId, items } = await req.json(); // items = [{rawMaterialId, qty, cost}]
    
    // Mulai Transaksi Database Berantai (Atomic)
    const po = await prisma.$transaction(async (tx) => {
      // 1. Buat Nota Belanja Induk
      const order = await tx.purchaseOrder.create({
        data: { supplierName, invoiceId, totalCost: 0, branchId }
      });

      let calculatedTotal = 0;

      for (const item of items) {
         const qty = parseFloat(item.qty);
         const cost = parseFloat(item.cost); // cost adalah HARGA PER 1 UNIT
         const subtotal = qty * cost;
         calculatedTotal += subtotal;

         // 2. Buat Lembaran Entri Rincian
         await tx.purchaseItem.create({
           data: {
             purchaseOrderId: order.id,
             rawMaterialId: item.rawMaterialId,
             quantityPurchased: qty,
             costPerUnit: cost,
             subtotal: subtotal
           }
         });

         // 3. KALKULASI HPP OTOMATIS BERBASIS WEIGHTED AVERAGE COST (Harga Pokok Rata-Rata)
         const rm = await tx.rawMaterial.findUnique({ where: { id: item.rawMaterialId } });
         if (rm) {
            const currentTotalValue = rm.stock * rm.costPerUnit; // Nilai modal di gudang saat ini
            const incomingValue = qty * cost; // Nilai modal masuk yang baru
            
            const newStock = rm.stock + qty;
            const newAverageCost = newStock > 0 ? (currentTotalValue + incomingValue) / newStock : cost;

            // 4. Update Saldo & HPP Gudang
            await tx.rawMaterial.update({
               where: { id: rm.id },
               data: {
                  stock: newStock,
                  costPerUnit: newAverageCost
               }
            });
         }
      }

      // 5. Finalisasi Tagihan Induk
      const finalOrder = await tx.purchaseOrder.update({
        where: { id: order.id },
        data: { totalCost: calculatedTotal },
        include: { items: { include: { rawMaterial: true } } }
      });

      return finalOrder;
    });

    return NextResponse.json(po);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
