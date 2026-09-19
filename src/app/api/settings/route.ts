import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

const SettingsSchema = z.object({
  companyName: z.string(),
  description: z.string(),
  phoneNumber: z.string(),
  whatsappNumber: z.string(),
  countryCode: z.string(),
  city: z.string(), // Add the 'city' property here
  socialLinks: z.array(
    z.object({
      icon: z.string(),
      link: z.string(),
    })
  ).optional(),
  whiteLogo: z.any(),
  blackLogo: z.any(),
  icon: z.any(),
});

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst({
      include: { socialLinks: true },
    });

    if (!settings) {
      return NextResponse.json({
        companyName: "",
        description: "",
        phoneNumber: "",
        whatsappNumber: "",
        countryCode: "",
        city: "",
        whiteLogo: "",
        blackLogo: "",
        icon: "",
        socialLinks: [],
      });
    }

    const formattedSettings = {
      ...settings,
      socialLinks: settings.socialLinks.map(link => ({ icon: link.icon, link: link.url })),
    };

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const validatedSettings = SettingsSchema.safeParse({
      companyName: data.get('companyName'),
      description: data.get('description'),
      phoneNumber: data.get('phoneNumber'),
      whatsappNumber: data.get('whatsappNumber'),
      countryCode: data.get('countryCode'),
      city: data.get('city'),
      socialLinks: data.get('socialLinks') ? JSON.parse(data.get('socialLinks') as string) : [],
      whiteLogo: data.get('whiteLogo'),
      blackLogo: data.get('blackLogo'),
      icon: data.get('icon'),
    });

    if (!validatedSettings.success) {
      console.error("Validation error:", validatedSettings.error.flatten().fieldErrors);
      return NextResponse.json({ error: validatedSettings.error.flatten().fieldErrors }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const saveFile = async (file: File | null, filename: string) => {
      if (file && typeof file.arrayBuffer === 'function') {
        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
        return `/uploads/${filename}`;
      }
      return null;
    };

    const whiteLogoPath = await saveFile(data.get('whiteLogo') as File | null, `${Date.now()}-whiteLogo.png`);
    const blackLogoPath = await saveFile(data.get('blackLogo') as File | null, `${Date.now()}-blackLogo.png`);
    const iconPath = await saveFile(data.get('icon') as File | null, `${Date.now()}-icon.png`);

    const updateData = {
      companyName: validatedSettings.data.companyName,
      description: validatedSettings.data.description,
      phoneNumber: validatedSettings.data.phoneNumber,
      whatsappNumber: validatedSettings.data.whatsappNumber,
      countryCode: validatedSettings.data.countryCode,
      city: validatedSettings.data.city,
      whiteLogo: whiteLogoPath || undefined,
      blackLogo: blackLogoPath || undefined,
      icon: iconPath || undefined,
    };

    const settings = await prisma.settings.findFirst();

    if (settings) {
      await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...updateData,
          socialLinks: {
            deleteMany: {},
            create: (validatedSettings.data?.socialLinks || []).map((link: any) => ({
              icon: link.icon,
              url: link.link,
            })) || [],
          },
        },
      });
    } else {
      await prisma.settings.create({
        data: {
          ...updateData,
          socialLinks: {
            create: (validatedSettings.data?.socialLinks || []).map((link: any) => ({
              icon: link.icon,
              url: link.link,
            })) || [],
          },
        },
      });
    }

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: 'Error updating settings' }, { status: 500 });
  }
}