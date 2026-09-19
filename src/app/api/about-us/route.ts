import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const parseForm = async (req: NextRequest): Promise<{ fields: any; files: any }> => {
  const data = await req.formData();
  const fields: any = {};
  const files: any = {};

  for (const [key, value] of data.entries()) {
    if (value instanceof Blob) {
      const file = value as File;
      const fileExtension = file.name.split('.').pop();
      const filename = `${Date.now()}.${fileExtension}`;
      const filePath = path.join(uploadDir, filename);
      const fileBuffer = new Uint8Array(await file.arrayBuffer());
      fs.writeFileSync(filePath, fileBuffer);
      files[key] = {
        path: `/uploads/${filename}`,
        name: filename,
      };
    } else {
      fields[key] = value.toString();
    }
  }

  return { fields, files };
};

export async function GET() {
  try {
    const aboutUs = await prisma.aboutUs.findFirst({
      include: { tags: true },
    });
    return NextResponse.json(aboutUs);
  } catch (error) {
    console.error("Error fetching About Us:", error);
    return NextResponse.json({ error: 'Error fetching About Us' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const { title, description, tags } = fields;
    let imagePath = null;

    // Fetch the existing aboutUs entry to get the current image path
    const existingAboutUs = await prisma.aboutUs.findFirst({ where: { id: 1 } });

    // If a new image is uploaded, delete the existing image
    if (files.image) {
      if (existingAboutUs && existingAboutUs.imagePath) {
        const existingImagePath = path.join(process.cwd(), 'public', existingAboutUs.imagePath);
        if (fs.existsSync(existingImagePath)) {
          fs.unlinkSync(existingImagePath);
        }
      }
      imagePath = files.image.path;
    } else if (existingAboutUs) {
      imagePath = existingAboutUs.imagePath; // Keep the existing image path if no new image is uploaded
    }

    const tagsArray = tags ? tags.split(',').map((tag: string) => tag.trim()) : [];

    const aboutUs = await prisma.aboutUs.upsert({
      where: { id: 1 }, // Assuming there's only one AboutUs entry
      update: {
        title,
        description,
        imagePath,
        tags: {
          deleteMany: {}, // Delete existing tags
          create: tagsArray.map((name: string) => ({ name })),
        },
      },
      create: {
        title,
        description,
        imagePath,
        tags: {
          create: tagsArray.map((name: string) => ({ name })),
        },
      },
    });

    // Ensure response includes updated tags array
    const updatedAboutUs = await prisma.aboutUs.findFirst({
      where: { id: 1 },
      include: { tags: true },
    });

    return NextResponse.json({ message: 'About Us updated successfully', aboutUs: updatedAboutUs });
  } catch (error) {
    console.error("Error updating About Us:", error);
    return NextResponse.json({ error: 'Error updating About Us' }, { status: 500 });
  }
}
