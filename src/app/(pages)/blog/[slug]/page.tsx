import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Sidebar from "@/app/components/Sidebar-blog";
import PagesLayout from "@/app/(pages)/layout";
import Image from "next/image";
import SocialShareButtons from "@/app/components/SocialShareButtons";
import AuthorBio from "@/app/components/AuthorBio";
import { fetchServices } from "@/app/lib/action";
import Breadcrumb from "@/app/components/Breadcrumb";
import Contact from "@/app/sections/Contact";
import BlogTracker from "@/app/components/BlogTracker";
import Link from "next/link";
import { FaCalendarAlt, FaUserAlt, FaTag, FaClock, FaEye } from "react-icons/fa";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getSettings() {
  const settings = await prisma.settings.findFirst();
  if (!settings) {
    throw new Error("Settings not found");
  }
  return settings;
}

async function getBlogPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      content: true,
      coverImage: true,
      author: true,
      createdAt: true,
      tags: true, // استخدام select لجلب الحقل tags
      // الحقول الأخرى...
    },
  });
  return post || null;
}

async function getRelatedPosts(slug: string) {
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      slug: {
        not: slug,
      },
    },
    take: 5,
  });
  return relatedPosts.map((post) => ({
    ...post,
    coverImage: post.coverImage ?? undefined,
  }));
}

async function getPageData(slug: string) {
  const [post, settings, relatedPosts, services] = await Promise.all([
    getBlogPostBySlug(slug),
    getSettings(),
    getRelatedPosts(slug),
    fetchServices(),
  ]);

  const servicesWithSlug = services.map((service) => ({
    ...service,
    slug: service.title.toLowerCase().replace(/\s+/g, "-"),
  }));

  if (!post) {
    notFound();
  }

  return { post, settings, relatedPosts, services: servicesWithSlug };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { post, settings } = await getPageData(params.slug);

  const pageTitle = `${post.title} | ${settings.companyName || "مدونة"}`;
  const pageDescription = post.description || "مقال من مدونتنا";
  const keywords = Array.isArray(post.tags) ? post.tags.join(", ") : "";
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`;

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: pageDescription,
      images: [
        {
          url: post.coverImage || "",
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
      tags: Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string') : [],
      siteName: settings.companyName || "مدونة",
      locale: "ar_EG",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: pageDescription,
      images: [post.coverImage || ""],
      creator: post.author,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: settings.icon || "",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      "article:author": post.author,
      "article:published_time": post.createdAt.toISOString(),
      "article:section": "مقالات",
      "article:tag": keywords,
    },
  };
}

export default async function SingleBlogPostPage({
  params,
  searchParams,
}: Props) {
  const { post, relatedPosts, services } = await getPageData(params.slug);

  return (
    <PagesLayout params={{ pageTitle: post.title }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* تتبع عرض صفحة المقال */}
        <BlogTracker blogTitle={post.title} blogSlug={params.slug} />
        
        {/* Hero Section */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* شريط التنقل */}
              <div className="mb-8">
                <Breadcrumb
                  items={[
                    { title: "الرئيسية", href: "/" },
                    { title: "المدونة", href: "/blog" },
                    { title: post.title },
                  ]}
                />
              </div>

              {/* العنوان الرئيسي */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* معلومات المقالة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 md:p-6 bg-white rounded-2xl shadow-lg">
                <div className="flex items-center text-gray-600 text-sm md:text-base">
                  <FaUserAlt className="ml-2 text-primary flex-shrink-0" />
                  <span className="font-medium truncate">{post.author}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm md:text-base">
                  <FaCalendarAlt className="ml-2 text-primary flex-shrink-0" />
                  <span className="truncate">
                    {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 text-sm md:text-base">
                  <FaClock className="ml-2 text-primary flex-shrink-0" />
                  <span>5 دقائق قراءة</span>
                </div>
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                  <div className="flex items-center text-gray-600 text-sm md:text-base sm:col-span-2 lg:col-span-1">
                    <FaTag className="ml-2 text-primary flex-shrink-0" />
                    <span className="truncate">{post.tags.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* صورة المقالة */}
        {post.coverImage && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    width={1200}
                    height={630}
                    src={post.coverImage}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-64 md:h-96 object-cover"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* محتوى المقالة */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article className="bg-white rounded-2xl shadow-xl p-4 md:p-8 lg:p-12">
                {/* محتوى المقالة */}
                <div
                  className="prose prose-lg max-w-none leading-relaxed text-gray-800 prose-headings:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:text-gray-800 prose-pre:bg-gray-900 prose-pre:text-white"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* أزرار المشاركة */}
                <div className="border-t border-gray-200 pt-6 md:pt-8 mt-8 md:mt-12">
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">شارك المقال</h3>
                    <div className="flex justify-center">
                      <SocialShareButtons
                        url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* مقالات ذات صلة */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gradient-to-br from-primary/5 to-orange-500/5">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">مقالات ذات صلة</h2>
                  <p className="text-xl text-gray-600">اكتشف المزيد من مقالاتنا المتميزة</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.slice(0, 3).map((relatedPost) => (
                    <Link 
                      key={relatedPost.id} 
                      href={`/blog/${relatedPost.slug}`}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 block cursor-pointer"
                    >
                      {relatedPost.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            width={400}
                            height={300}
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {relatedPost.description || "لا يوجد وصف"}
                        </p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FaCalendarAlt className="ml-2" />
                          <span>
                            {new Date(relatedPost.createdAt).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </PagesLayout>
  );
}
