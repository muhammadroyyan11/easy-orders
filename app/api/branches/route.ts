import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({ orderBy: { name: 'asc' } });
    const currentBranchId = await getCurrentBranchId();
    return NextResponse.json({ branches, currentBranchId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, address, phone } = await req.json();
    const newBranch = await prisma.branch.create({ 
      data: { name, address, phone }
    });
    return NextResponse.json(newBranch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, address, phone } = await req.json();
    const updated = await prisma.branch.update({
      where: { id },
      data: { name, address, phone }
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID Required" }, { status: 400 });

    await prisma.branch.delete({ where: { id }});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus cabang (Sistem menolak karena cabang tersebut memiliki data transaksi aktif yang masih terikat)." }, { status: 500 });
  }
}
