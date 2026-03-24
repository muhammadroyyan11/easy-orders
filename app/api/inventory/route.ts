import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';

export async function GET() {
  try {
    const branchId = await getCurrentBranchId();
    const materials = await prisma.rawMaterial.findMany({
      where: { branchId },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(materials);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const { name, sku, unit } = await req.json();
    const material = await prisma.rawMaterial.create({
      data: { name, sku, unit, branchId }
    });
    return NextResponse.json(material);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.rawMaterial.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
