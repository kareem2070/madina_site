import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const colors = await prisma.colorSettings.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json({ error: 'Error fetching colors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { primaryColor, secondaryColor, buttonColor } = body;

    if (!primaryColor || !secondaryColor || !buttonColor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const settings = await prisma.colorSettings.create({
      data: {
        primaryColor,
        secondaryColor,
        buttonColor,
      },
    });
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error creating color settings:', error);
    return NextResponse.json({ error: 'Error creating color settings' }, { status: 500 });
  }
}
