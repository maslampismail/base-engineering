import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductsListClient from './ProductsListClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  return <ProductsListClient initialProducts={products} categories={categories} />;
}
