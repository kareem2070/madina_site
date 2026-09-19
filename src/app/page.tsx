// app/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getData } from "@/app/lib/data";
import { prisma } from "@/app/lib/prisma";
import {
  DynamicProducts,
  DynamicServices,
  DynamicPortfolio,
  DynamicCustomer,
  DynamicBlogPostsSlider,
} from "@/app/components/DynamicWrapper";
import { getSiteSettings, createSEOConfig, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";
import SEOOptimizedLoader from "@/app/components/SEOOptimizedLoader";

// المكونات المحملة بشكل ديناميكي مع تحسين الأداء
const Hero = dynamic(() => import("@/app/sections/Hero"), {
  loading: () => <SEOOptimizedLoader message="جاري تحميل القسم الرئيسي..." />,
  ssr: true, // Hero مهم للـ SEO
});

const About = dynamic(() => import("@/app/sections/about"), {
  ssr: false,
  loading: () => <SEOOptimizedLoader message="جاري تحميل قسم من نحن..." />,
});

const WhyUs = dynamic(() => import("@/app/sections/why-us"), {
  loading: () => <SEOOptimizedLoader message="جاري تحميل قسم لماذا نحن..." />,
  ssr: true, // مهم للـ SEO
});

const Contact = dynamic(() => import("@/app/sections/Contact"), {
  loading: () => <SEOOptimizedLoader message="جاري تحميل قسم التواصل..." />,
  ssr: false, // لا يحتاج SSR
});

// إعادة التحقق كل 60 ثانية لتحسين الأداء
export const revalidate = 60;
export const runtime = 'nodejs';

// دالة جلب المقالات محسنة
async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 6, // تقليل عدد المقالات
      select: {
        id: true,
        slug: true,
        title: true,
        author: true,
        coverImage: true,
        createdAt: true,
        description: true, // استخدام description بدلاً من content
      },
    });

    return posts.map((post) => ({
      ...post,
      content: post.description || "لا يوجد وصف متاح",
      excerpt: post.description || "لا يوجد وصف متاح",
      coverImage: post.coverImage ?? undefined,
      createdAt: post.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// مكون الصفحة الرئيسية
export default async function Home() {
  // جلب البيانات
  const { hero, aboutUs } = await getData();
  const heroWithFixedImagePath = hero
    ? { ...hero, imagePath: hero.imagePath! }
    : null;
  const postsWithExcerpts = await getBlogPosts();
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `${hero?.title || "زهرة الربيع"} | ${siteSettings.settings?.phoneNumber || ""} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    siteSettings.settings?.description || 
    `زهرة الربيع - شركة رائدة في تقديم الخدمات والمنتجات المتميزة. نقدم أفضل الحلول والخدمات لعملائنا الكرام. تواصل معنا الآن!`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `${hero?.title || ""} ${siteSettings.settings?.description || ""} ${aboutUs?.description || ""}`;
  const keywords = generateKeywords(content, pageTitle, [
    "زهرة الربيع", "خدمات", "منتجات", "شركة", "مصر", "حلول", "جودة", "تميز"
  ]);

  // إنشاء SEO config للصفحة الرئيسية
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: hero?.imagePath || siteSettings.settings?.icon || undefined,
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://zahret-alrabie.com",
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
  });

  // إنشاء structured data للصفحة الرئيسية
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://zahret-alrabie.com",
  }, siteSettings);

  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <SEOOptimizedLoader message="جاري تحميل الصفحة الرئيسية..." size="lg" />
          </div>
        }
      >
        <Hero hero={heroWithFixedImagePath} />
      </Suspense>

      {aboutUs && (
        <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل قسم من نحن..." />}>
          <About aboutUs={aboutUs} />
        </Suspense>
      )}

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل الخدمات..." />}>
        <DynamicServices />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل قسم لماذا نحن..." />}>
        <WhyUs />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل المنتجات..." />}>
        <DynamicProducts color="bg-gray-100" />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل معرض الأعمال..." />}>
        <DynamicPortfolio color="bg-gray-100" />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل آراء العملاء..." />}>
        <DynamicCustomer color="bg-gray-100" />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل المقالات..." />}>
        <DynamicBlogPostsSlider posts={postsWithExcerpts} />
      </Suspense>

      <Suspense fallback={<SEOOptimizedLoader message="جاري تحميل قسم التواصل..." />}>
        <Contact />
      </Suspense>
    </main>
  );
}
