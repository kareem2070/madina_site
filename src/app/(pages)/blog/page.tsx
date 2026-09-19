import PagesLayout from "@/app/(pages)/layout";
import CardBlog from "@/app/components/CardBlog";
import { prisma } from "@/app/lib/prisma";
import type { Metadata } from "next";
import { getSiteSettings, createSEOConfig, createStructuredData, optimizeMetaDescription, generateKeywords } from "@/app/lib/seoConfig";
import BlogPostsClient from "@/app/components/BlogPostsClient";

// إضافة revalidation للصفحة
export const revalidate = 0; // إعادة التحقق من البيانات في كل طلب

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      author: true,
      coverImage: true,
      createdAt: true,
    },
  });

  // توليد مقتطفات من المحتوى
  return posts.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    coverImage: post.coverImage ?? undefined,
    description: post.description ?? "", // Add a default value for description
  }));
}

async function getSettings() {
  const settings = await prisma.settings.findFirst();
  return settings;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: `المدونة | ${settings?.phoneNumber || "رقم الهاتف"} | ${
      settings?.companyName || "اسم الشركة"
    }`,
    description: settings?.description || "...",

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
  };
}

export default async function BlogIndexPage() {
  // جلب المقالات الأولية
  const initialPosts = await getBlogPosts();
  const siteSettings = await getSiteSettings();

  // إنشاء محتوى محسن للSEO
  const pageTitle = `المدونة | ${siteSettings.settings?.phoneNumber || "رقم الهاتف"} | ${siteSettings.settings?.companyName || "زهرة الربيع"}`;
  const pageDescription = optimizeMetaDescription(
    `اكتشف أحدث المقالات والأخبار في مدونة زهرة الربيع. نشارككم نصائح ومعلومات مفيدة حول خدماتنا ومنتجاتنا المتميزة.`,
    160
  );

  // إنشاء keywords ديناميكية
  const content = `مدونة زهرة الربيع مقالات أخبار نصائح معلومات مفيدة`;
  const keywords = generateKeywords(content, pageTitle, [
    "مدونة", "مقالات", "أخبار", "نصائح", "معلومات", "زهرة الربيع", "خدمات", "منتجات"
  ]);

  // إنشاء SEO config لصفحة المدونة
  const seoConfig = createSEOConfig({
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    image: siteSettings.settings?.icon || undefined,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    siteName: siteSettings.settings?.companyName || "زهرة الربيع",
  });

  // إنشاء structured data لصفحة المدونة
  const structuredData = createStructuredData({
    title: pageTitle,
    description: pageDescription,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
  }, siteSettings);

  return (
    <PagesLayout params={{ pageTitle: "المدونة" }}>
      <BlogPostsClient initialPosts={initialPosts} />
    </PagesLayout>
  );
}
