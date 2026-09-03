import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { deleteFile } from '@/lib/r2';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Support looking up by ID or by slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error retrieving product:', error);
    return NextResponse.json({ error: 'Failed to retrieve product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
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
      featured,
      active,
      sortOrder,
      images,
    } = data;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    let slug = existingProduct.slug;
    if (customSlug && customSlug !== existingProduct.slug) {
      slug = slugify(customSlug);
      const conflict = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      });
      if (conflict) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        slug,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
        shortDescription: shortDescription !== undefined ? shortDescription : existingProduct.shortDescription,
        description: description !== undefined ? description : existingProduct.description,
        material: material !== undefined ? material : existingProduct.material,
        specifications:
          specifications !== undefined
            ? typeof specifications === 'object'
              ? JSON.stringify(specifications)
              : specifications
            : existingProduct.specifications,
        applications: applications !== undefined ? applications : existingProduct.applications,
        featured: featured !== undefined ? Boolean(featured) : existingProduct.featured,
        active: active !== undefined ? Boolean(active) : existingProduct.active,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existingProduct.sortOrder,
      },
    });

    // If new images provided, sync images
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: images[i].url,
            alt: images[i].alt || updated.name,
            isPrimary: images[i].isPrimary ?? i === 0,
            sortOrder: i,
            objectKey: images[i].objectKey || null,
          },
        });
      }
    }

    const result = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] },
      },
    });

    return NextResponse.json({ success: true, product: result });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Delete associated image files from R2 / local
    const images = await prisma.productImage.findMany({ where: { productId: id } });
    for (const img of images) {
      if (img.objectKey) {
        await deleteFile(img.objectKey);
      }
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
