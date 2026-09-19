
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const whyUs = await prisma.whyUs.findFirst();
    return NextResponse.json(whyUs);
  } catch (error) {
    console.error("Error fetching Why Us:", error);
    return NextResponse.json({ error: 'Error fetching Why Us' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const whyUs = await prisma.whyUs.upsert({
      where: { id: 1 },
      update: {
        title,
        description,
      },
      create: {
        title,
        description,
      },
    });

    return NextResponse.json({ message: 'Why Us updated successfully', whyUs });
  } catch (error) {
    console.error("Error updating Why Us:", error);
    return NextResponse.json({ error: 'Error updating Why Us' }, { status: 500 });
  }
}
