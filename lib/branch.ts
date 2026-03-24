import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function getDefaultBranch() {
  let branch = await prisma.branch.findFirst({
    orderBy: { createdAt: 'asc' }
  });
  
  if (!branch) {
     branch = await prisma.branch.create({
        data: { name: 'Pusat (Headquarters)' }
     });
  }
  return branch.id;
}

export async function getCurrentBranchId() {
  // Support for Multi-Outlet Toggle inside Auth Cookies
  const cookieStore = await cookies();
  const sessionBranch = cookieStore.get('active_branch')?.value;
  if (sessionBranch) return sessionBranch;
  
  // Auto-Fallback to HQ if roaming
  return await getDefaultBranch();
}
