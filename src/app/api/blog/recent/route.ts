import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
export async function GET(request: Request) {
    try {
      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      return NextResponse.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  }