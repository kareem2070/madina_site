import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import fs from "fs";
import path from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Delete main image
    if (service.imagePath) {
      const filePath = path.join(process.cwd(), "public", service.imagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete gallery images
    if (service.galleryImages) {
      const galleryImages = JSON.parse(service.galleryImages);
      galleryImages.forEach((image: string) => {
        const filePath = path.join(process.cwd(), "public", image);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Delete the service from the database
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}