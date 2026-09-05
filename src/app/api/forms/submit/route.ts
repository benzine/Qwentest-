import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/forms/submit - Public endpoint to submit form data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, formData, ipAddress } = body;

    if (!formId || !formData) {
      return NextResponse.json({ error: 'Form ID and form data are required' }, { status: 400 });
    }

    // Verify form exists and is active
    const form = await (prisma as any).formConfig?.findUnique({
      where: { id: formId },
    });

    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Form not found or inactive' }, { status: 404 });
    }

    // Create submission
    const submission = await (prisma as any).formSubmission?.create({
      data: {
        formId,
        formData,
        ipAddress: ipAddress || null,
      },
    });

    // TODO: Send email notification to admin using nodemailer
    // await sendNotificationEmail(submission);

    return NextResponse.json({ 
      message: 'Form submitted successfully',
      submissionId: submission.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/forms/submit - Get public form configuration
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const formId = searchParams.get('id');

    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 });
    }

    const form = await (prisma as any).formConfig?.findUnique({
      where: { id: formId },
      select: {
        id: true,
        name: true,
        fields: true,
        isActive: true,
      },
    });

    if (!form || !form.isActive) {
      return NextResponse.json({ error: 'Form not found or inactive' }, { status: 404 });
    }

    return NextResponse.json({ form });
  } catch (error) {
    console.error('Get form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
