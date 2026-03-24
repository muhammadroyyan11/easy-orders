import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Auto-Seeding Database: Jika tabel User masih murni/kosong
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const hashedPassword = bcrypt.hashSync('password123', 10);
      await prisma.user.create({
        data: {
          name: 'Super Admin',
          email: 'admin@resto.com',
          password: hashedPassword, // Disuntikkan sebagai Hash Kriptografi
          role: 'ADMIN'
        }
      });
    } else {
      // Auto-Healing: Cek apabila ada akun lama yang masih menggunakan Plaintext (belum dienkripsi)
      const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@resto.com' }});
      if (existingAdmin && existingAdmin.password === 'password123') {
         // Migrasi data pasif menjadi format Hash secara konstan via Background Layer
         const newHashedPassword = bcrypt.hashSync('password123', 10);
         await prisma.user.update({
           where: { email: 'admin@resto.com' },
           data: { password: newHashedPassword }
         });
      }
    }

    // Tarik legitimasi kredensial dari tabel MySQL
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Otorisasi Ditolak! Akun tidak ditemukan di Database." }, { status: 401 });
    }

    // Komparasi Input Kustomer (Plain) versus Cipher Hash di Database (Bcrypt)
    const isMatch = bcrypt.compareSync(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json({ error: "Otorisasi Ditolak! Cek ulang sandi Anda." }, { status: 401 });
    }

    // Terbitkan JWT / Http-Only Session Token ke peramban Kasir
    // Next.js 15+ Mewajibkan deklarasi Await pada manipulasi Cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ success: true, user: { name: user.name, role: user.role } });
    
  } catch (error: any) {
    console.error('Terminal Server Intercept: ', error);
    return NextResponse.json({ error: error.message || "Server Database Terkendala / Kriptografi Invalid." }, { status: 500 });
  }
}
