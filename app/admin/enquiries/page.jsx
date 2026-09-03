import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EnquiriesClient from './EnquiriesClient';

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const enquiries = await prisma.enquiry.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return <EnquiriesClient initialEnquiries={enquiries} />;
}
