import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

const imageSchema = z.object({
  images: z.array(z.any()),
});

export async function GET() {
  try {
    const images = await prisma.image.findMany();
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const files = Array.from(data.values()).filter(value => value instanceof Blob) as Blob[];

    const validation = imageSchema.safeParse({ images: files });

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery-image');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const images = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const fileExtension = file.type.split('/').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filePath, buffer);
      const url = `/uploads/gallery-image/${filename}`;
      const image = await prisma.image.create({ data: { url } });
      images.push(image);
    }

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    const filePath = path.join(process.cwd(), 'public', url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      const image = await prisma.image.findUnique({ where: { url } });
      if (image) {
        await prisma.image.delete({ where: { id: image.id } });
        return NextResponse.json({ message: 'Image deleted successfully' });
      } else {
        return NextResponse.json({ error: 'Image not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
