import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import HighlightsClient from './HighlightsClient';

export const revalidate = 0;

export default async function AdminHighlightsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const highlights = await prisma.companyHighlight.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return <HighlightsClient initialHighlights={highlights} />;
}
