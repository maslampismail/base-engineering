import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HomepageClient from './HomepageClient';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminHomepagePage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const heroSection = await prisma.homepageSection.findUnique({
    where: { sectionKey: 'hero' },
  });

  return <HomepageClient initialHero={heroSection} />;
}
