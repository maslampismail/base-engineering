import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  });

  return <ProductForm categories={categories} />;
}
