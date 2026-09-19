
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';

const ContactSchema = z.object({
  title: z.string(),
  description: z.string(),
  address: z.string(),
  email: z.string().email(),
  city: z.string(), // حقل المدينة الجديد
});

export async function GET() {
  try {
    const contactInfo = await prisma.contactInfo.findUnique({
      where: { id: 1 },
    });

    if (!contactInfo) {
      return NextResponse.json({
        title: "",
        description: "",
        address: "",
        email: "",
        city: "", // حقل المدينة الجديد
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return NextResponse.json({ error: 'Error fetching contact info' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = ContactSchema.safeParse(data);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const contactData = validatedData.data;

    const updatedContactInfo = await prisma.contactInfo.upsert({
      where: { id: 1 },
      update: contactData,
      create: contactData,
    });

    return NextResponse.json(updatedContactInfo);
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json({ error: 'Error updating contact info' }, { status: 500 });
  }
}
