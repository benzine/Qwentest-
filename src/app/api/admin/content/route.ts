import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '../auth/route';

// GET /api/admin/content - Get all content blocks
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    const whereClause = section ? { section } : {};
    
    const contentBlocks = await (prisma as any).contentBlock?.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ contentBlocks: contentBlocks || [] });
  } catch (error) {
    console.error('Get content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/content - Create new content block
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { key, section, type, data, order = 0 } = body;

    if (!key || !section || !type) {
      return NextResponse.json({ error: 'Key, section, and type are required' }, { status: 400 });
    }

    const contentBlock = await (prisma as any).contentBlock?.create({
      data: {
        key,
        section,
        type,
        data: data || {},
        order,
      },
    });

    return NextResponse.json({ contentBlock }, { status: 201 });
  } catch (error) {
    console.error('Create content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/content - Update content block
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { id, key, section, type, data, order, isActive } = body;

    if (!id && !key) {
      return NextResponse.json({ error: 'ID or key is required' }, { status: 400 });
    }

    const whereClause = id ? { id } : { key };
    
    const contentBlock = await (prisma as any).contentBlock?.update({
      where: whereClause,
      data: {
        ...(key && { key }),
        ...(section && { section }),
        ...(type && { type }),
        ...(data && { data }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ contentBlock });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/content - Delete content block
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await (prisma as any).contentBlock?.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Content block deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
