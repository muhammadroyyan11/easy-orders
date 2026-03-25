import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentBranchId } from '@/lib/branch';

export async function GET(req: Request) {
  try {
    const branchId = await getCurrentBranchId();
    const { searchParams } = new URL(req.url);
    const pageStr = searchParams.get('page');
    const limitStr = searchParams.get('limit');
    const search = searchParams.get('search') || '';
    
    const where: any = { branchId };
    if (search) where.name = { contains: search };

    if (pageStr && limitStr) {
       const page = parseInt(pageStr);
       const limit = parseInt(limitStr);
       const [totalRecords, categories] = await Promise.all([
         prisma.category.count({ where }),
         prisma.category.findMany({
           where,
           orderBy: { createdAt: 'asc' },
           skip: (page - 1) * limit,
           take: limit
         })
       ]);
       return NextResponse.json({ categories, totalRecords, totalPages: Math.ceil(totalRecords / limit) });
    }

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
