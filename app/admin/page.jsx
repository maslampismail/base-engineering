import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const [
    totalProducts,
    activeProducts,
    totalCategories,
    newEnquiries,
    totalEnquiries,
    recentEnquiries,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.category.count(),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
    prisma.enquiry.count(),
    prisma.enquiry.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
  ]);

  const stats = {
    totalProducts,
    activeProducts,
    totalCategories,
    newEnquiries,
    totalEnquiries,
  };

  return (
    <DashboardClient
      stats={stats}
      recentEnquiries={recentEnquiries}
      recentProducts={recentProducts}
    />
  );
}
