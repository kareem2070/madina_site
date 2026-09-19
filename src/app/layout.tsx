import { Almarai } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/app/components/Header/Navbar";
import Footer from "@/app/sections/footer";
import { prisma } from "@/app/lib/prisma";
import { SettingsProvider } from "@/app/lib/SettingsProvider";
import Call from "@/app/components/Call";
import GTMTracker from "@/app/components/GTMTracker";
import type { Metadata } from "next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import { getSiteSettings, createSEOConfig, createStructuredData } from "@/app/lib/seoConfig";

const almarai = Almarai({ 
  subsets: ["arabic"], 
  weight: ["400", "700"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-almarai',
  adjustFontFallback: false,
});


async function getInitialSettings() {
  const hero = await prisma.hero.findFirst();
  const settings = await prisma.settings.findFirst({
    include: {
      socialLinks: true,
    },
  });
  return { hero, settings };
}

export async function generateMetadata(): Promise<Metadata> {
  const initialSettings = await getInitialSettings();
  const { hero, settings } = initialSettings;

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "https://zahret-alrabie.com"
    ),
    title: `${hero?.title || "Default Title"} | ${
      settings?.phoneNumber || ""
    } | ${settings?.companyName || "Default Title"}`,
    description: settings?.description || "Default Description",
    openGraph: {
      title: `${hero?.title || "Default Title"} | ${
        settings?.phoneNumber || ""
      } | ${settings?.companyName || "Default Title"}`,
      description: settings?.description || "Default Description",
      images: [
        {
          url: hero?.imagePath || "",
          width: 800,
          height: 600,
          alt: settings?.companyName || "Default Title",
        },
      ],
    },
    icons: {
      icon: settings?.icon || "",
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialSettings = await getInitialSettings();
  const siteSettings = await getSiteSettings();

  // إنشاء SEO config افتراضي
  const defaultSEOConfig = createSEOConfig({
    title: `${initialSettings.hero?.title || "زهرة الربيع"} | ${initialSettings.settings?.phoneNumber || ""} | ${initialSettings.settings?.companyName || "هرة الربيع"}`,
    description: initialSettings.settings?.description || "زهرة اربيع - شركة رائدة في تقديم الخدمات المنتجات المتميزة",
    keywords: ["زهرة الربيع", "خدمات", "منتجات", "شركة", "مصر"],
    image: initialSettings.hero?.imagePath || initialSettings.settings?.icon || undefined,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: initialSettings.settings?.companyName ,
  });

  // إنشاء structured data
  const structuredData = createStructuredData({
    title: initialSettings.hero?.title || "زهرة الربيع",
    description: initialSettings.settings?.description || "زهرة الربيع - شركة رائدة ي تقديم الخدمات والمنتجات المتميز",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://zahret-alrabie.com",
  }, siteSettings);

  return (
    <html lang="ar" dir="rtl" className={almarai.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        {Array.isArray(structuredData) ? (
          structuredData.map((data, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(data),
              }}
            />
          ))
        ) : (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}
      </head>
      <SettingsProvider initialSettings={initialSettings}>
        <body className={`overflow-x-hidden ${almarai.className}`}>
          <Suspense fallback={null}>
            <GTMTracker />
          </Suspense>
          <Navbar />
          {children}
          <Footer />
          <Call />
        </body>
      </SettingsProvider>
    </html>
  );
}
