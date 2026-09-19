import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import ServiceDetail from "@/app/components/ServiceDetail";
// لا نحتاج PagesLayout لأننا سنستخدم layout مخصص للخدمات
import { getSiteSettings, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";

type Props = {
  params: { title: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getSettings() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    throw new Error("Settings not found");
  }
  return settings;
}

async function getServiceByTitle(title: string) {
  const decodedTitle = decodeURIComponent(
    title.replace(/-/g, " ")
  ).toLowerCase();
  const services = await prisma.service.findMany();
  const service = services.find((s) => s.title.toLowerCase() === decodedTitle);
  return service || null;
}

async function getPageData(title: string) {
  const [service, settings] = await Promise.all([
    getServiceByTitle(title),
    getSettings(),
  ]);

  if (!service) {
    notFound();
  }

  return { service, settings };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { service, settings } = await getPageData(params.title);

  const pageTitle = `${service.title} ${settings.city} - ${settings.phoneNumber} - ${settings.companyName}`;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pageTitle,
    description: service.description,
    openGraph: {
      title: pageTitle,
      description: service.description,
      images: [
        {
          url: service.imagePath || "",
          width: 800,
          height: 600,
          alt: service.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: service.description,
      images: [service.imagePath || ""],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: settings.icon || "",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/services/${params.title}`,
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { service, settings } = await getPageData(params.title);
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `${service.title} | ${settings.city || "مصر"} | ${settings.phoneNumber} | ${settings.companyName}`;
  const pageDescription = optimizeMetaDescription(
    service.description || 
    `اكتشف خدمة ${service.title} المتميزة من زهرة الربيع. نقدم أفضل الخدمات المهنية عالية الجودة في ${settings.city || "مصر"}.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `${service.title} ${service.description} ${settings.city || "مصر"} خدمة`;
  const keywords = generateKeywords(content, pageTitle, [
    service.title, "خدمة", "زهرة الربيع", settings.city || "مصر", "مهنية", "جودة"
  ]);

  // إنشاء SEO config لصفحة الخدمة (مبسط)
  const seoConfig = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: service.imagePath || siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/services/${params.title}`,
    siteName: settings.companyName || "زهرة الربيع",
    type: 'service' as const,
  };

  // إنشاء structured data لصفحة الخدمة
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/services/${params.title}`,
    type: 'service',
  }, siteSettings);

  return <ServiceDetail service={service} />;
}
