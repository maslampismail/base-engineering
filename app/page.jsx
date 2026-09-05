import prisma from '@/lib/prisma';
import LandingClient from '@/components/LandingClient';

export const revalidate = 0; // Always serve fresh data
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [
    company,
    heroSection,
    categories,
    products,
    highlights,
    applications,
  ] = await Promise.all([
    prisma.company.findFirst(),
    prisma.homepageSection.findUnique({ where: { sectionKey: 'hero' } }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.product.findMany({
      where: { active: true },
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
    }),
    prisma.companyHighlight.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.application.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <LandingClient
      company={company}
      heroSection={heroSection}
      categories={categories}
      products={products}
      highlights={highlights}
      applications={applications}
    />
  );
}
