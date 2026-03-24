import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone');

  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 });

  try {
    const member = await prisma.member.findUnique({ where: { phone } });
    if (!member) return NextResponse.json({ points: 0, isNew: true });
    return NextResponse.json({ points: member.points, isNew: false });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
