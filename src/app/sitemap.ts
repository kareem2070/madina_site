import { MetadataRoute } from 'next'
import { prisma } from "@/app/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zahret-alrabie.com';

  const staticRoutes = [
    { 
      url: baseUrl, 
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    { 
      url: `${baseUrl}/products`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    { 
      url: `${baseUrl}/services`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    { 
      url: `${baseUrl}/projects`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    { 
      url: `${baseUrl}/blog`, 
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    // إضافة صفحات إضافية مهمة
    { 
      url: `${baseUrl}/sitemap.xml`, 
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    { 
      url: `${baseUrl}/robots.txt`, 
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // جلب الخدمات وتوليد مساراتها
  const services = await prisma.service.findMany();
  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service.title.replace(/\s+/g, '-').toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // جلب المقالات وتوليد مساراتها
  const blogPosts = await prisma.blogPost.findMany();
  const blogRoutes = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // دمج جميع المسارات
  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}