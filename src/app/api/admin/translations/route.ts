import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '../auth/route';

// GET /api/admin/translations - Get all translations or filtered by language
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
    const language = searchParams.get('language');

    const whereClause = language ? { language } : {};
    
    const translations = await (prisma as any).translation?.findMany({
      where: whereClause,
      orderBy: { key: 'asc' },
    });

    // Group by key for easier consumption
    const grouped = (translations || []).reduce((acc: any, t: any) => {
      acc[t.key] = acc[t.key] || {};
      acc[t.key][t.language] = t.value;
      return acc;
    }, {});

    return NextResponse.json({ translations: grouped });
  } catch (error) {
    console.error('Get translations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/translations - Create or update translation
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
    const { key, language, value } = body;

    if (!key || !language || !value) {
      return NextResponse.json({ error: 'Key, language, and value are required' }, { status: 400 });
    }

    // Upsert translation
    const translation = await (prisma as any).translation?.upsert({
      where: {
        key_language: {
          key,
          language,
        },
      },
      update: { value },
      create: {
        key,
        language,
        value,
      },
    });

    return NextResponse.json({ translation }, { status: 201 });
  } catch (error) {
    console.error('Create translation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/translations - Bulk update translations
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
    const { translations } = body; // Array of { key, language, value }

    if (!Array.isArray(translations)) {
      return NextResponse.json({ error: 'Translations must be an array' }, { status: 400 });
    }

    const results = [];
    for (const t of translations) {
      const translation = await (prisma as any).translation?.upsert({
        where: {
          key_language: {
            key: t.key,
            language: t.language,
          },
        },
        update: { value: t.value },
        create: {
          key: t.key,
          language: t.language,
          value: t.value,
        },
      });
      results.push(translation);
    }

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error('Bulk update translations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/translations - Delete translation
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
    const key = searchParams.get('key');
    const language = searchParams.get('language');

    if (!key || !language) {
      return NextResponse.json({ error: 'Key and language are required' }, { status: 400 });
    }

    await (prisma as any).translation?.delete({
      where: {
        key_language: {
          key,
          language,
        },
      },
    });

    return NextResponse.json({ message: 'Translation deleted successfully' });
  } catch (error) {
    console.error('Delete translation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
