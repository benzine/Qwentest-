import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '../auth/route';

// GET /api/admin/settings - Get site settings
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Allow public read access for frontend to fetch settings
      // In production, you might want to restrict this
    }

    const settings = await (prisma as any).siteSettings?.findUnique({
      where: { id: 'singleton' },
    });

    return NextResponse.json({ settings: settings || getDefaultSettings() });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Update site settings
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
    const {
      siteName,
      primaryColor,
      accentColor,
      fontHeading,
      fontBody,
      accessibilityHighContrast,
      accessibilityReducedMotion,
    } = body;

    const settings = await (prisma as any).siteSettings?.upsert({
      where: { id: 'singleton' },
      update: {
        ...(siteName && { siteName }),
        ...(primaryColor && { primaryColor }),
        ...(accentColor && { accentColor }),
        ...(fontHeading && { fontHeading }),
        ...(fontBody && { fontBody }),
        ...(accessibilityHighContrast !== undefined && { accessibilityHighContrast }),
        ...(accessibilityReducedMotion !== undefined && { accessibilityReducedMotion }),
      },
      create: {
        id: 'singleton',
        siteName: siteName || 'Consulting Firm',
        primaryColor: primaryColor || '#0f172a',
        accentColor: accentColor || '#d4af37',
        fontHeading: fontHeading || 'Playfair Display',
        fontBody: fontBody || 'Inter',
        accessibilityHighContrast: accessibilityHighContrast || false,
        accessibilityReducedMotion: accessibilityReducedMotion || false,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getDefaultSettings() {
  return {
    id: 'singleton',
    siteName: 'Consulting Firm',
    primaryColor: '#0f172a',
    accentColor: '#d4af37',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    accessibilityHighContrast: false,
    accessibilityReducedMotion: false,
  };
}
