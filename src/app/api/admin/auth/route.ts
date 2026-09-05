import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helper to verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// POST /api/admin/auth/register - Initial admin registration (should be protected in production)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, enable2FA } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await (prisma as any).user?.findUnique({ where: { email } });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate 2FA secret if requested
    let twoFactorSecret = null;
    let twoFactorEnabled = false;
    let qrCodeUrl = null;

    if (enable2FA) {
      twoFactorSecret = speakeasy.generateSecret({
        name: `Consulting Firm Admin (${email})`,
        issuer: 'Consulting Firm',
        length: 32,
      });
      twoFactorEnabled = true;
      
      // Generate QR code for authenticator app
      qrCodeUrl = await QRCode.toDataURL(twoFactorSecret.otpauth_url!);
    }

    // Create user
    const user = await (prisma as any).user?.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN',
        twoFactorSecret: twoFactorSecret?.base32,
        twoFactorEnabled,
      },
      select: {
        id: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json({
      message: 'User created successfully',
      user,
      qrCodeUrl,
      twoFactorSecret: twoFactorSecret?.base32, // Only send this once during setup
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/admin/auth/login - Handle login page request
export async function GET() {
  return NextResponse.json({ message: 'Auth endpoint ready' });
}

// PUT /api/admin/auth/login - Login with optional 2FA
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, twoFactorCode } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const user = await (prisma as any).user?.findUnique({ where: { email } });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { error: 'Two-factor authentication required', requires2FA: true },
          { status: 401 }
        );
      }

      const validToken = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 2,
      });

      if (!validToken) {
        return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 });
      }
    }

    // Update last login
    await (prisma as any).user?.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Middleware wrapper for protected routes
export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Attach user info to request
    (req as any).user = decoded;
    return handler(req);
  };
}
