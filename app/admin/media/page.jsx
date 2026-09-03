import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MediaClient from './MediaClient';

export const revalidate = 0;

export default async function AdminMediaPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return <MediaClient initialMedia={media} />;
}
