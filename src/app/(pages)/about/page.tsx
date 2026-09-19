// app/(pages)/about/page.tsx

import PagesLayout from "@/app/(pages)/layout";
import type { Metadata } from "next";
import { prisma } from "@/app/lib/prisma";
import { getSiteSettings, createSEOConfig, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";
import dynamic from "next/dynamic";

// Dynamic import for About component to avoid framer-motion SSR issues
const About = dynamic(() => import("@/app/sections/about"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل قسم من نحن...</p>
          </div>
        </div>
      </div>
    </div>
  ),
});

// Dynamic import for Customer component to avoid framer-motion SSR issues
const Customer = dynamic(() => import("@/app/sections/customer"), {
  ssr: false,
  loading: () => (
    <div className="bg-zinc-100 relative overflow-hidden">
      <div className="container mx-auto py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل قسم آراء العملاء...</p>
          </div>
        </div>
      </div>
    </div>
  ),
});
async function getAboutUsData() {
  const aboutUs = await prisma.aboutUs.findFirst({
    include: {
      tags: true,
    },
  });
  return aboutUs;
}

async function getSettings() {
  const settings = await prisma.settings.findFirst();
  return settings;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: `من نحن | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
    openGraph: {
      title: `من نحن | ${settings?.phoneNumber || "رقم الهاتف"} | ${
        settings?.companyName || "اسم الشركة"
      }`,
      description: settings?.description || "وصف افتراضي إذا لم يتوفر وصف.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      type: "website",
      images: [
        {
          url: settings?.icon
            ? `${process.env.NEXT_PUBLIC_BASE_URL}${settings.icon}`
            : "",
          width: 800,
          height: 600,
          alt: settings?.companyName || "اسم الشركة",
        },
      ],
      locale: "ar_AR",
      siteName: settings?.companyName || "اسم الشركة",
    },
    icons: {
      icon: settings?.icon
        ? `${process.env.NEXT_PUBLIC_BASE_URL}${settings.icon}`
        : "",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    },
  };
}

export default async function AboutPage() {
  const aboutUs = await getAboutUsData();
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `من نحن | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    aboutUs?.description || 
    `تعرف على زهرة الربيع - شركتنا الرائدة في تقديم الخدمات والمنتجات المتميزة. اكتشف رؤيتنا ورسالتنا وقيمنا التي تجعلنا الخيار الأول لعملائنا.`,
    160
  );

  // إزالة الكلمات المفتاحية
  const keywords: string[] = [];

  // إنشاء SEO config لصفحة من نحن
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
  });

  // إنشاء structured data لصفحة من نحن
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
  }, siteSettings);

  return (
    <PagesLayout params={{ pageTitle: "من نحن" }}>
      {aboutUs && <About aboutUs={aboutUs} />}
      <Customer color="bg-zinc-100" />
    </PagesLayout>
  );
}
