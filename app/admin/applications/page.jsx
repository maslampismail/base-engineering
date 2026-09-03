import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ApplicationsClient from './ApplicationsClient';

export const revalidate = 0;

export default async function AdminApplicationsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const applications = await prisma.application.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <ApplicationsClient initialApplications={applications} />;
}
