import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sections = await prisma.homepageSection.findMany();
    return NextResponse.json({ success: true, sections });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sectionKey, heading, subheading, description, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, imageUrl, active } = await request.json();

    if (!sectionKey) {
      return NextResponse.json({ error: 'sectionKey is required' }, { status: 400 });
    }

    const section = await prisma.homepageSection.upsert({
      where: { sectionKey },
      update: {
        heading,
        subheading,
        description,
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        imageUrl,
        active: active !== undefined ? Boolean(active) : undefined,
      },
      create: {
        sectionKey,
        heading: heading || 'Reliable Engineering Solutions for Modern Construction',
        subheading,
        description,
        primaryCtaText,
        primaryCtaLink,
        secondaryCtaText,
        secondaryCtaLink,
        imageUrl,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/homepage');

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error('Error updating homepage section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
