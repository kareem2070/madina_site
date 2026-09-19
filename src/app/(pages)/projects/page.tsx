import PagesLayout from "@/app/(pages)/layout";
import Projects from "@/app/sections/portfolio"; // تأكد من صحة اسم المكون
import Customer from "@/app/sections/customer";
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
    title: `مشاريع نفتخر بيها | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
    openGraph: {
      title: `مشاريع نفتخر بيها | ${settings?.phoneNumber || "رقم الهاتف"} | ${
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
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
    },
  };
}

// مكون الصفحة
export default async function ProjectsPage() {
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `مشاريع نفتخر بيها | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    `اكتشف مشاريع زهرة الربيع المتميزة التي نفخر بها - معرض لأفضل أعمالنا وإنجازاتنا. مشاريع ناجحة ومراجع عملاء سعداء.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `مشاريع زهرة الربيع إنجازات أعمال ناجحة مراجع`;
  const keywords = generateKeywords(content, pageTitle, [
    "مشاريع", "إنجازات", "أعمال", "ناجحة", "مراجع", "زهرة الربيع", "معرض"
  ]);

  // إنشاء SEO config لصفحة المشاريع
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
  });

  // إنشاء structured data لصفحة المشاريع
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/projects`,
  }, siteSettings);

  return (
    <PagesLayout params={{ 
      pageTitle: "مشاريع نفتخر بيها",
      pageDescription: "اكتشف مشاريعنا المتميزة التي نفخر بها - معرض لأفضل أعمالنا وإنجازاتنا"
    }}>
      <Projects color="bg-zinc-100" />
      <Customer color="bg-zinc-100" />
    </PagesLayout>
  );
}
