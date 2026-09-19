import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, newMobile } = body;

    if (!id || !newMobile) {
      return NextResponse.json({ message: 'Invalid request: Missing ID or new mobile number' }, { status: 400 });
    }

    // Log the values for debugging
    console.log("Updating mobile for ID:", id, "New Mobile:", newMobile);

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user's mobile number
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { mobile: newMobile },
    });

    return NextResponse.json({ message: 'Mobile number updated successfully' });
  } catch (error: any) {
    console.error("Error during Prisma operation:", error);

    // Check for Prisma-specific errors
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Record to update not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}