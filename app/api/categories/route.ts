import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';

export async function GET() {
  try {
    const branchId = await getCurrentBranchId();
    const categories = await prisma.category.findMany({
      where: { branchId },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const body = await req.json();
    const newCategory = await prisma.category.create({
      data: { name: body.name, branchId }
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });
    
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus kategori. Pastikan sudah tidak ada menu di dalamnya." }, { status: 500 });
  }
}
