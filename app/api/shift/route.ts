import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pos_token')?.value;
  if (!token) {
     if (cookieStore.get('admin_session')?.value === 'authenticated') {
        return { id: 'legacy-admin-id', name: 'Administrator', role: 'SUPERADMIN' };
     }
     return null;
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch(e) { return null; }
}

export async function GET(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'history') {
       const pageStr = searchParams.get('page');
       const limitStr = searchParams.get('limit');
       const search = searchParams.get('search') || '';

       const where: any = { branchId: user.role === 'SUPERADMIN' ? undefined : branchId };
       
       if (search) {
          where.OR = [
             { cashierName: { contains: search } },
             { notes: { contains: search } }
          ];
       }

       if (pageStr && limitStr) {
          const page = parseInt(pageStr);
          const limit = parseInt(limitStr);
          const [totalRecords, shifts] = await Promise.all([
             prisma.cashShift.count({ where }),
             prisma.cashShift.findMany({
               where,
               include: { branch: { select: { name: true } } },
               orderBy: { createdAt: 'desc' },
               skip: (page - 1) * limit,
               take: limit
             })
          ]);
          return NextResponse.json({ shifts, totalRecords, totalPages: Math.ceil(totalRecords / limit) });
       }

       const shifts = await prisma.cashShift.findMany({
         where,
         include: { branch: { select: { name: true } } },
         orderBy: { createdAt: 'desc' },
         take: 100
       });
       return NextResponse.json({ shifts });
    }

    const activeShift = await prisma.cashShift.findFirst({
      where: { branchId, cashierName: user.name, status: 'OPEN' }
    });

    let expectedCash = activeShift?.startingCash || 0;
    let cashOrdersTotal = 0;
    if (activeShift) {
      const cashOrders = await prisma.order.aggregate({
        where: {
          branchId,
          paymentMethod: 'kasir',
          paymentStatus: 'PAID',
          createdAt: { gte: activeShift.startTime }
        },
        _sum: { totalAmount: true }
      });
      cashOrdersTotal = cashOrders._sum?.totalAmount || 0;
      expectedCash += cashOrdersTotal;
    }

    return NextResponse.json({ activeShift, expectedCash, cashOrdersTotal });
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

export async function POST(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const body = await req.json();
    const { startingCash } = body;

    const activeShift = await prisma.cashShift.findFirst({
      where: { branchId, cashierName: user.name, status: 'OPEN' }
    });

    if (activeShift) {
      return NextResponse.json({error: "Anda sudah memiliki shift yang berstatus OPEN!"}, {status: 400});
    }

    const shift = await prisma.cashShift.create({
      data: {
        branchId,
        cashierName: user.name,
        startingCash: Number(startingCash) || 0,
        status: 'OPEN'
      }
    });

    return NextResponse.json({ success: true, shift });
  } catch(e: any) {
    return NextResponse.json({error: e.message}, {status: 500});
  }
}

export async function PATCH(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const user = await getCurrentUser();
    if(!user) return NextResponse.json({error: "Unauthorized"}, {status: 401});

    const body = await req.json();
    const { actualCash, shiftId } = body;

    const shift = await prisma.cashShift.findUnique({ where: { id: shiftId } });
    if (!shift || shift.cashierName !== user.name) return NextResponse.json({error: "Otoritas Shift tidak valid"}, {status: 400});
    if (shift.status === 'CLOSED') return NextResponse.json({error: "Shift sudah ditutup"}, {status: 400});

    const cashOrders = await prisma.order.aggregate({
      where: {
        branchId,
        paymentMethod: 'kasir',
        paymentStatus: 'PAID',
        createdAt: { gte: shift.startTime }
      },
      _sum: { totalAmount: true }
    });
    
    const cashOrdersTotal = cashOrders._sum?.totalAmount || 0;
    const expectedCash = shift.startingCash + cashOrdersTotal;
    const actual = Number(actualCash) || 0;

    const updated = await prisma.cashShift.update({
      where: { id: shiftId },
      data: {
        endTime: new Date(),
        expectedCash,
        actualCash: actual,
        status: 'CLOSED'
      }
    });

    return NextResponse.json({ success: true, shift: updated });
  } catch(e: any) {
    return NextResponse.json({error: e.message}, {status: 500});
  }
}
