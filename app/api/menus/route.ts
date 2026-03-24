import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const menus = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(menus);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMenu = await prisma.menuItem.create({
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        image: body.image,
        popular: body.popular || false,
        categoryId: body.categoryId,
      }
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });
    
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus menu." }, { status: 500 });
  }
}
