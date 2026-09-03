import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, enquiries });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, company, phone, email, productId, message } = await request.json();

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: 'Name, phone, email, and message are required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        company: company || null,
        phone,
        email,
        productId: productId || null,
        message,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your enquiry. Base Engineering team will contact you shortly.',
      enquiryId: enquiry.id,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry. Please try again.' }, { status: 500 });
  }
}
