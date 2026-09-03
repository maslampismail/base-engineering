import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CategoriesClient from './CategoriesClient';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return <CategoriesClient initialCategories={categories} />;
}
