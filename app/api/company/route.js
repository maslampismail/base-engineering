import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({
        data: {
          id: 'default',
          name: 'Base Engineering',
          tagline: 'Engineering Strength. Built to Perform.',
          aboutHeading: 'Built on Engineering. Driven by Reliability.',
          aboutDescription: 'Base Engineering is a premier manufacturer of scaffolding and construction support products.',
        },
      });
    }
    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json({ error: 'Failed to fetch company info' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const existing = await prisma.company.findFirst();
    const companyId = existing?.id || 'default';

    const company = await prisma.company.upsert({
      where: { id: companyId },
      update: {
        name: data.name,
        tagline: data.tagline,
        aboutHeading: data.aboutHeading,
        aboutDescription: data.aboutDescription,
        aboutImage: data.aboutImage,
        phone: data.phone,
        email: data.email,
        address: data.address,
        website: data.website,
        socialLinks: typeof data.socialLinks === 'object' ? JSON.stringify(data.socialLinks) : data.socialLinks,
      },
      create: {
        id: 'default',
        name: data.name || 'Base Engineering',
        tagline: data.tagline || 'Engineering Strength. Built to Perform.',
        aboutHeading: data.aboutHeading || 'Built on Engineering. Driven by Reliability.',
        aboutDescription: data.aboutDescription || '',
        aboutImage: data.aboutImage || null,
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        website: data.website || '',
        socialLinks: typeof data.socialLinks === 'object' ? JSON.stringify(data.socialLinks) : data.socialLinks,
      },
    });

    return NextResponse.json({ success: true, company });
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json({ error: 'Failed to update company info' }, { status: 500 });
  }
}
