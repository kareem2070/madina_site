import { getServiceById, fetchServices } from "@/app/lib/action";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

async function getSettings() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    throw new Error('Settings not found');
  }
  return settings;
}

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service: any) => ({
    id: service.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const service = await getServiceById(Number(params.id));
  const settings = await getSettings();

  if (!service) {
    return notFound();
  }

  return {
    title: `${settings.companyName} - ${service.title}`,
    description: service.description,
    openGraph: {
      title: `${settings.companyName} - ${service.title}`,
      description: service.description,
      images: [
        {
          url: service.imagePath,
          width: 800,
          height: 600,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.companyName} - ${service.title}`,
      description: service.description,
      images: [
        {
          url: service.imagePath,
          width: 800,
          height: 600,
          alt: service.title,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}