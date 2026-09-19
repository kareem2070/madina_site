import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.customerReview.findMany();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    return NextResponse.json({ error: 'Error fetching customer reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, review, rating, region } = body;

    if (!customerName || !review || !rating || !region) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customerReview = await prisma.customerReview.create({
      data: {
        customerName,
        review,
        rating: parseInt(rating, 10),
        region,
      },
    });

    return NextResponse.json({ message: 'Review added successfully', customerReview });
  } catch (error : any) {
    console.error("Error adding review:", error);
    return NextResponse.json({ error: `Error adding review: ${error.message}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, customerName, review, rating, region } = body;

    if (!id || !customerName || !review || !rating || !region) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customerReview = await prisma.customerReview.update({
      where: { id: parseInt(id, 10) },
      data: {
        customerName,
        review,
        rating: parseInt(rating, 10),
        region,
      },
    });

    return NextResponse.json({ message: 'Review updated successfully', customerReview });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: `Error updating review: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.customerReview.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: `Error deleting review: ${error.message}` }, { status: 500 });
  }
}
