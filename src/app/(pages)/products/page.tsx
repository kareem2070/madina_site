// app/(pages)/products/page.tsx

import PagesLayout from "@/app/(pages)/layout";
import Proudct from "@/app/sections/Products"; // تأكد من صحة اسم المكون، ربما يكون "Product" بدلاً من "Proudct"
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
    title: `منتجاتنا | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
    openGraph: {
      title: `منتجاتنا | ${settings?.phoneNumber || "رقم الهاتف"} | ${
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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    },
  };
}

// مكون الصفحة
export default async function ProductsPage() {
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `منتجاتنا | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    `اكتشف منتجات زهرة الربيع المتميزة - نقدم مجموعة واسعة من المنتجات عالية الجودة التي تلبي احتياجاتكم. منتجات موثوقة ومضمونة الجودة.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `منتجات زهرة الربيع جودة عالية موثوقة مضمونة`;
  const keywords = generateKeywords(content, pageTitle, [
    "منتجات", "زهرة الربيع", "جودة", "موثوقة", "مضمونة", "تسوق", "شراء"
  ]);

  // إنشاء SEO config لصفحة المنتجات
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
    type: 'product',
  });

  // إنشاء structured data لصفحة المنتجات
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
    type: 'product',
  }, siteSettings);

  return (
    <PagesLayout params={{ pageTitle: "منتجاتنا" }}>
      <div>
        <Proudct color="bg-gray-200" />
      </div>
    </PagesLayout>
  );
}
