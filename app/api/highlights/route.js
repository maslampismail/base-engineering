import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const highlights = await prisma.companyHighlight.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ success: true, highlights });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    return NextResponse.json({ error: 'Failed to fetch highlights' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, value, description, icon, sortOrder = 0, active = true } = await request.json();

    if (!title || !value) {
      return NextResponse.json({ error: 'Title and Value are required' }, { status: 400 });
    }

    const highlight = await prisma.companyHighlight.create({
      data: {
        title,
        value,
        description,
        icon: icon || 'Star',
        sortOrder: Number(sortOrder) || 0,
        active: Boolean(active),
      },
    });

    return NextResponse.json({ success: true, highlight }, { status: 201 });
  } catch (error) {
    console.error('Error creating highlight:', error);
    return NextResponse.json({ error: 'Failed to create highlight' }, { status: 500 });
  }
}
