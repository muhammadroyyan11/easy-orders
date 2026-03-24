import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { branch: true },
      orderBy: { createdAt: 'desc' }
    });
    // Hashing sanitization sebelum dikirim ke Client
    const safeUsers = users.map(u => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safe } = u;
      return safe;
    });
    return NextResponse.json(safeUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role, branchId } = await req.json();
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email sudah terdaftar!" }, { status: 400 });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        branchId: role === 'SUPERADMIN' ? null : branchId
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = newUser;
    return NextResponse.json(safe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "ID Required" }, { status: 400 });

    await prisma.user.delete({ where: { id }});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menghapus user. Pastikan bukan Administrator tunggal." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, email, role, branchId, password } = await req.json();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: any = { name, email, role, branchId: role === 'SUPERADMIN' ? null : branchId };

    if (password && password.trim() !== '') {
       dataToUpdate.password = bcrypt.hashSync(password, 10);
    }

    const updated = await prisma.user.update({
       where: { id },
       data: dataToUpdate
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...safe } = updated;
    return NextResponse.json(safe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
