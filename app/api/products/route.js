import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const featuredOnly = searchParams.get('featured') === 'true';
    const includeInactive = searchParams.get('all') === 'true';

    const where = {};
    if (!includeInactive) {
      where.active = true;
    }
    if (featuredOnly) {
      where.featured = true;
    }
    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const {
      name,
      slug: customSlug,
      categoryId,
      shortDescription,
      description,
      material,
      specifications,
      applications,
      featured = false,
      active = true,
      sortOrder = 0,
      images = [],
    } = data;

    if (!name || !shortDescription || !description) {
      return NextResponse.json(
        { error: 'Name, short description, and description are required' },
        { status: 400 }
      );
    }

    let slug = customSlug ? slugify(customSlug) : slugify(name);

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId: categoryId || null,
        shortDescription,
        description,
        material: material || null,
        specifications: typeof specifications === 'object' ? JSON.stringify(specifications) : specifications,
        applications: applications || null,
        featured: Boolean(featured),
        active: Boolean(active),
        sortOrder: Number(sortOrder) || 0,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || name,
            isPrimary: img.isPrimary ?? index === 0,
            sortOrder: index,
            objectKey: img.objectKey || null,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product: ' + error.message }, { status: 500 });
  }
}
