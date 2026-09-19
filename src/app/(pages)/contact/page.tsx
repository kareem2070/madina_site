import PagesLayout from "@/app/(pages)/layout";
import Contact from "@/app/sections/Contact";
import { prisma } from "@/app/lib/prisma";
import type { Metadata } from "next";
import { getSiteSettings, createSEOConfig, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";

// دالة لجلب بيانات الإعدادات
async function getSettings() {
  const settings = await prisma.settings.findFirst();
  return settings;
}

// دالة لتوليد الميتاداتا
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: `تواصل معنا | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
    openGraph: {
      title: `تواصل معنا | ${settings?.phoneNumber || "رقم الهاتف"} | ${
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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
  };
}

// مكون الصفحة
export default async function ContactPage() {
  const settings = await getSettings(); // جلب بيانات الإعدادات إذا كنت بحاجة لاستخدامها في الصفحة
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `تواصل معنا | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    `تواصل مع زهرة الربيع - نحن هنا لخدمتكم. اتصل بنا الآن للحصول على أفضل الخدمات والمنتجات. فريقنا المتخصص جاهز للإجابة على استفساراتكم.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `تواصل معنا زهرة الربيع اتصل بنا خدمة عملاء استفسارات`;
  const keywords = generateKeywords(content, pageTitle, [
    "تواصل", "اتصال", "خدمة عملاء", "استفسارات", "زهرة الربيع", "دعم", "مساعدة"
  ]);

  // إنشاء SEO config لصفحة التواصل
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
  });

  // إنشاء structured data لصفحة التواصل
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
  }, siteSettings);

  return (
    <PagesLayout params={{ pageTitle: "تواصل معنا" }}>
      <Contact />
    </PagesLayout>
  );
}
