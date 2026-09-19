"use server";
import { z } from "zod";
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

const ServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  imagePath: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
});

const saveFile = async (file: File, folder = 'uploads'): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const uploadPath = path.join(process.cwd(), 'public', folder, filename);
  const fileData = await file.arrayBuffer();
  fs.writeFileSync(uploadPath, new Uint8Array(fileData));
  return `/${folder}/${filename}`;
};

export const createService = async (formData: FormData) => {
  try {
    // جمع صور المعرض ومساراتها
    const galleryImages: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'galleryImages' && value instanceof File) {
        const imagePath = await saveFile(value);
        galleryImages.push(imagePath);
      }
    }

    // جمع الحقول النصية
    const fields: any = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        fields[key] = value;
      }
    }

    // معالجة صورة الخدمة الرئيسية
    const imageFile = formData.get('image') as File | null;
    let imagePath: string | null = null;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveFile(imageFile);
    }

    // إضافة مسارات الصور إلى الحقول
    fields.imagePath = imagePath;
    fields.galleryImages = galleryImages;

    // التحقق من الحقول
    const validatedFields = ServiceSchema.safeParse(fields);

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return {
        Errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // إنشاء الخدمة في قاعدة البيانات
    await prisma.service.create({
      data: {
        ...validatedFields.data,
        galleryImages: JSON.stringify(validatedFields.data.galleryImages),
      },
    });

    return { message: "Service created successfully!" };
  } catch (error: any) {
    console.error("Error creating service:", error);
    return {
      message: "Failed to create service",
      error: error.message,
    };
  }
};

export const fetchServices = async () => {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        content: true,
        imagePath: true,
        galleryImages: true,
        order: true,
        createdAt: true,
        updatedAt: true,
         // Add this line to include the slug property
      },
    });
    return services;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
};

export const getServiceById = async (id: number) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service;
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return null;
  }
};

export const updateService = async (id: number, formData: FormData) => {
  const entries = Object.fromEntries(formData.entries());

  const validatedFields = ServiceSchema.safeParse(entries);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error);
    return {
      message: "Failed to update service",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const imageFile = formData.get("image") as File | null;
    let imagePath = validatedFields.data.imagePath;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveFile(imageFile);
    }

    const newGalleryImages: string[] = [];
    const galleryImagesToKeep = new Set<string>();
    const existingService = await prisma.service.findUnique({ where: { id } });

    if (!existingService) {
      throw new Error("Service not found");
    }

    const galleryImages = existingService.galleryImages ? JSON.parse(existingService.galleryImages) : [];

    for (let i = 0; i < galleryImages.length; i++) {
      if (formData.has(`deleteGalleryImage_${i}`)) {
        const imagePath = path.join(process.cwd(), "public", galleryImages[i]);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } else {
        galleryImagesToKeep.add(galleryImages[i]);
      }
    }

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("galleryImage_") && value instanceof File) {
        const filePath = await saveFile(value);
        newGalleryImages.push(filePath);
      }
    }

    const finalGalleryImages = [...galleryImagesToKeep, ...newGalleryImages];

    await prisma.service.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        content: validatedFields.data.content,
        imagePath,
        galleryImages: JSON.stringify(finalGalleryImages),
      },
    });

    return { message: "Service updated successfully!" };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { message: "Failed to update service." };
  }
};


export const updateServiceOrder = async (id: number, order: number) => {
  try {
    await prisma.service.update({
      where: { id },
      data: { order },
    });
    return { message: "Service order updated successfully" };
  } catch (error) {
    console.error("Failed to update service order:", error);
    return { error: "Failed to update service order" };
  }
};