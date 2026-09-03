import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, media: mediaList });
  } catch (error) {
    console.error('Error fetching media list:', error);
    return NextResponse.json({ error: 'Failed to fetch media list' }, { status: 500 });
  }
}
