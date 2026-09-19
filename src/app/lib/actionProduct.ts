"use server";
import { z } from "zod";
import { prisma } from '@/app/lib/prisma';
import fs from 'fs';
import path from 'path';

const ProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  imagePath: z.string().optional(),
});

const saveFile = async (file: File, folder = 'uploads') => {
  const fileExtension = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
  const uploadPath = path.join(process.cwd(), 'public', folder, filename);
  const fileData = await file.arrayBuffer();
  fs.writeFileSync(uploadPath, new Uint8Array(fileData));

  return `/uploads/${filename}`;
};

export const saveProduct = async (formData: FormData) => {
  const entries: any = Object.fromEntries(formData.entries());

  if (typeof entries.price === 'string') {
    entries.price = parseFloat(entries.price);
  }

  const validatedFields = ProductSchema.safeParse(entries);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error);
    return {
      Errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const imageFile = formData.get('image');
    let imagePath = null;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveFile(imageFile);
    }

    await prisma.product.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        imagePath,
      },
    });

    return { message: "Product saved successfully!" };
  } catch (error: any) {
    console.error("Error saving product:", error);
    return {
      message: "Failed to save product",
      error: error.message,
    };
  }
};

export const fetchProducts = async () => {
  try {
    const products = await prisma.product.findMany();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  const entries: any = Object.fromEntries(formData.entries());

  if (typeof entries.price === 'string') {
    entries.price = parseFloat(entries.price);
  }

  const validatedFields = ProductSchema.safeParse(entries);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten().fieldErrors);
    return {
      Errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const imageFile = formData.get("image");
    let imagePath = validatedFields.data.imagePath;

    if (imageFile && imageFile instanceof File) {
      imagePath = await saveFile(imageFile);
    }

    await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        imagePath,
      },
    });

    return { message: "Product updated successfully!" };
  } catch (error) {
    console.error("Failed to update product:", error);
    return {
      message: "Failed to update product.",
    };
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product?.imagePath) {
      const filePath = path.join(process.cwd(), 'public', product.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return { message: "Product deleted successfully" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { error: "Failed to delete product" };
  }
};
