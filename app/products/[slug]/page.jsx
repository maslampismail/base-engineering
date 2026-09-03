import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    return {
      title: 'Product Not Found | Base Engineering',
    };
  }

  return {
    title: `${product.name} | Base Engineering`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Base Engineering`,
      description: product.shortDescription,
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  const [product, company] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: [
            { isPrimary: 'desc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    }),
    prisma.company.findFirst(),
  ]);

  if (!product) {
    notFound();
  }

  // Related products from same category or active products
  const relatedProducts = await prisma.product.findMany({
    where: {
      active: true,
      NOT: { id: product.id },
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    },
    take: 3,
    include: {
      category: true,
      images: {
        orderBy: [
          { isPrimary: 'desc' },
          { sortOrder: 'asc' },
        ],
      },
    },
  });

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      company={company}
    />
  );
}
