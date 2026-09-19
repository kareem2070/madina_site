import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        title: true,
        description: true, // تأكد من إضافة هذا السطر لجلب الوصف
        content: true,
        author: true,
        tags: true,
        coverImage: true,
        createdAt: true,
        slug: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
} 

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    
    let tags;
    try {
      tags = JSON.parse(formData.get('tags') as string);
    } catch (parseError) {
      console.error("Error parsing tags:", parseError);
      return NextResponse.json({ error: "Invalid tags format" }, { status: 400 });
    }

    const coverImageFile = formData.get('coverImage') as File | null;
    let coverImagePath = null;

    if (coverImageFile) {
      const fileExtension = coverImageFile.name.split('.').pop();
      const filename = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      try {
        const fileBuffer = Buffer.from(await coverImageFile.arrayBuffer());
        fs.writeFileSync(filePath, new Uint8Array(fileBuffer));        coverImagePath = `/uploads/${filename}`;
      } catch (fileError) {
        console.error("Error saving cover image:", fileError);
        return NextResponse.json({ error: "Failed to save cover image" }, { status: 500 });
      }
    }

    console.log("Updating post with data:", {
      title, description, content, author, tags, coverImagePath
    });

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        description,
        content,
        author,
        tags,
        coverImage: coverImagePath || undefined,
      },
    });

    return NextResponse.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.coverImage) {
      const filePath = path.join(process.cwd(), 'public', post.coverImage);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkError) {
          console.error("Error deleting cover image:", unlinkError);
        }
      }
    }

    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}