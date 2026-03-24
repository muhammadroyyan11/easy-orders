import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const menuItemId = searchParams.get('menuItemId');

    if (menuItemId) {
      const recipes = await prisma.recipe.findMany({
        where: { menuItemId },
        include: { rawMaterial: true }
      });
      return NextResponse.json(recipes);
    } else {
      const recipes = await prisma.recipe.findMany({
        include: { rawMaterial: true, menuItem: true }
      });
      return NextResponse.json(recipes);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { menuItemId, rawMaterialId, quantityUsed } = await req.json();
    const recipe = await prisma.recipe.create({
      data: {
        menuItemId,
        rawMaterialId,
        quantityUsed: parseFloat(quantityUsed)
      },
      include: { rawMaterial: true }
    });
    return NextResponse.json(recipe);
  } catch (error: any) {
    if (error.code === 'P2002') {
       return NextResponse.json({ error: 'Bahan Baku ini sudah ada di dalam Resep Menu tersebut.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.recipe.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
