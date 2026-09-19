import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

const videoSchema = z.object({
  videos: z.array(z.any()),
});

export async function GET() {
  try {
    const videos = await prisma.video.findMany();
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files = Array.from(data.values()).filter(value => value instanceof File) as File[];

    const validation = videoSchema.safeParse({ videos: files });

    if (!validation.success) {
      console.error("Validation failed:", validation.error);
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery-video');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const videos = [];
    for (const file of files) {
      const fileExtension = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
      const url = `/uploads/gallery-video/${filename}`;
      const video = await prisma.video.create({ data: { url } });
      videos.push(video);
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error uploading videos:", error);
    return NextResponse.json({ error: 'Failed to upload videos' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    const filePath = path.join(process.cwd(), 'public', url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      const video = await prisma.video.findUnique({ where: { url } });
      if (video) {
        await prisma.video.delete({ where: { id: video.id } });
        return NextResponse.json({ message: 'Video deleted successfully' });
      } else {
        return NextResponse.json({ error: 'Video not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
