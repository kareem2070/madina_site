import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to parse form data and handle file uploads
const parseForm = async (req: Request) => {
  const formData = await req.formData();
  const fields: any = {};
  const files: any = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      const file = value as File;
      const fileExtension = file.name.split('.').pop();
      const filename = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      const fileBuffer = new Uint8Array(await file.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
      files[key] = {
        path: `/uploads/blog/${filename}`,
        name: filename,
      };
    } else {
      fields[key] = value.toString();
    }
  }

  return { fields, files };
};

// API to create a new blog post
export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    const { title, description, content, slug, author, tags } = fields;
    let coverImage = files.coverImage ? files.coverImage.path : null;

    // معالجة الـ tags بشكل آمن
    let parsedTags = [];
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch (e) {
      parsedTags = [];
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        description,
        content,
        slug,
        author,
        tags: parsedTags,
        coverImage,
      },
    });

    // إضافة إشعار لتحديث المقالات في المتصفح
    const response = NextResponse.json(post, { status: 201 });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // إضافة header لإشعار العميل بوجود مقالة جديدة
    response.headers.set('X-New-Post', 'true');
    // ترميز العنوان بـ base64 لتجنب مشاكل الأحرف العربية في HTTP headers
    response.headers.set('X-Post-Title', Buffer.from(title).toString('base64'));

    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ 
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// API to get all blog posts
export async function GET(request: Request) {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        author: true,
        coverImage: true,
        createdAt: true,
      },
    });
    const response = NextResponse.json(posts);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// API to update an existing blog post
export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  try {
    const { fields, files } = await parseForm(req);
    const { title, description, content, author, tags } = fields;
    let coverImage = files.coverImage ? files.coverImage.path : null;

    // Retrieve the existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // If a new cover image is uploaded, delete the old image
    if (coverImage && existingPost.coverImage) {
      const existingImagePath = path.join(process.cwd(), 'public', existingPost.coverImage);
      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }
    } else {
      coverImage = existingPost.coverImage; // Retain the old image if no new image is uploaded
    }

    // معالجة الـ tags بشكل آمن
    let parsedTags: any[] = [];
    try {
      parsedTags = tags ? JSON.parse(tags) : [];
    } catch (e) {
      parsedTags = Array.isArray(existingPost.tags) ? existingPost.tags : [];
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        description,
        content,
        author,
        tags: parsedTags,
        coverImage,
      },
    });

    return NextResponse.json({ message: 'Blog post updated successfully', updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ 
      error: 'Error updating blog post',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}