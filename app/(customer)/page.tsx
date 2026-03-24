import MenuClient from './MenuClient';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [categories, menuItems] = await Promise.all([
    prisma.category.findMany(),
    prisma.menuItem.findMany({ include: { category: true }, orderBy: { createdAt: 'desc'} })
  ]);
  
  return <MenuClient categories={categories} menuItems={menuItems} />;
}
