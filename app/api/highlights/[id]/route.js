import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, value, description, icon, sortOrder, active } = await request.json();

    const updated = await prisma.companyHighlight.update({
      where: { id },
      data: {
        title,
        value,
        description,
        icon,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/highlights');

    return NextResponse.json({ success: true, highlight: updated });
  } catch (error) {
    console.error('Error updating highlight:', error);
    return NextResponse.json({ error: 'Failed to update highlight' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await prisma.companyHighlight.delete({ where: { id } });

    revalidatePath('/');
    revalidatePath('/admin/highlights');

    return NextResponse.json({ success: true, message: 'Highlight deleted' });
  } catch (error) {
    console.error('Error deleting highlight:', error);
    return NextResponse.json({ error: 'Failed to delete highlight' }, { status: 500 });
  }
}

