// app/(pages)/services/page.tsx

import PagesLayout from "@/app/(pages)/layout";
import Services from "@/app/sections/services";
import { prisma } from "@/app/lib/prisma";
import type { Metadata } from "next";
import { getSiteSettings, createSEOConfig, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";

// دالة لجلب بيانات الإعدادات من قاعدة البيانات
async function getSettings() {
  const settings = await prisma.settings.findFirst();
  return settings;
}

// دالة لتوليد الميتاداتا
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: `خدمتنا المتميزة | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
    openGraph: {
      title: `خدمتنا المتميزة | ${settings?.phoneNumber || "رقم الهاتف"} | ${
        settings?.companyName || "اسم الشركة"
      }`,
      description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
      images: [
        {
          url: settings?.icon || "",
          width: 800,
          height: 600,
          alt: settings?.companyName || "اسم الشركة",
        },
      ],
    },
    icons: {
      icon: settings?.icon || "",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    },
  };
}

// مكون الصفحة
export default async function ServicesPage() {
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `خدمتنا المتميزة | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    `اكتشف خدمات زهرة الربيع المتميزة - نقدم مجموعة شاملة من الخدمات المهنية عالية الجودة. فريق متخصص وخدمة عملاء متميزة.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `خدمات زهرة الربيع متميزة مهنية عالية الجودة`;
  const keywords = generateKeywords(content, pageTitle, [
    "خدمات", "زهرة الربيع", "متميزة", "مهنية", "جودة", "فريق متخصص", "دعم"
  ]);

  // إنشاء SEO config لصفحة الخدمات
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
    type: 'service',
  });

  // إنشاء structured data لصفحة الخدمات
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    type: 'service',
  }, siteSettings);

  return (
    <PagesLayout params={{ pageTitle: "خدمتنا المتميزة" }}>
      <Services color="bg-gray-200" />
    </PagesLayout>
  );
}
