import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CompanyClient from './CompanyClient';

export const revalidate = 0;

export default async function AdminCompanyPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const company = await prisma.company.findFirst();

  return <CompanyClient initialCompany={company} />;
}
