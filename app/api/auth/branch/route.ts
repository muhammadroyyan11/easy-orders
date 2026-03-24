import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { branchId } = await req.json();
    const cookieStore = await cookies();
    cookieStore.set('active_branch', branchId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: "Gagal mengganti cabang" }, { status: 500 });
  }
}
