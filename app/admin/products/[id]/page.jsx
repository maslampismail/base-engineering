import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export const revalidate = 0;

export default async function EditProductPage({ params }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const { id } = params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  if (!product) notFound();

  return <ProductForm initialData={product} categories={categories} />;
}
