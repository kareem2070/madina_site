import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const parseForm = async (req: NextRequest) => {
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
    const hero = await prisma.hero.findFirst();
    if (!hero) {
      return NextResponse.json({ hero: { title: "", description: "", imagePath: "" } });
    }
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching Hero:", error);
    return NextResponse.json({ error: 'Error fetching Hero' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { fields, files } = await parseForm(req);

    const { title, description } = fields;
    let imagePath = null;

    const existingHero = await prisma.hero.findFirst();

    if (files.image) {
      if (existingHero && existingHero.imagePath) {
        const existingImagePath = path.join(process.cwd(), 'public', existingHero.imagePath);
        if (fs.existsSync(existingImagePath)) {
          fs.unlinkSync(existingImagePath);
        }
      }
      imagePath = files.image.path;
    } else if (existingHero) {
      imagePath = existingHero.imagePath;
    }

    const hero = await prisma.hero.upsert({
      where: { id: existingHero ? existingHero.id : 1 },
      update: {
        title,
        description,
        imagePath,
      },
      create: {
        title,
        description,
        imagePath,
      },
    });

    return NextResponse.json({ message: 'Hero updated successfully', hero });
  } catch (error) {
    console.error("Error updating Hero:", error);
    return NextResponse.json({ error: 'Error updating Hero' }, { status: 500 });
  }
}