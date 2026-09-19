import { prisma } from './prisma';

// واجهة لإعدادات SEO الأساسية
export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  locale?: string;
  siteName?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

// دالة لجلب إعدادات الموقع من قاعدة البيانات
export async function getSiteSettings() {
  const settings = await prisma.settings.findFirst({
    include: {
      socialLinks: true,
    },
  });
  
  const hero = await prisma.hero.findFirst();
  
  return { settings, hero };
}

// دالة لإنشاء SEO config مبسط
export function createSEOConfig(config: SEOConfig) {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(', ') || 'زهرة الربيع, خدمات, منتجات, شركة',
    image: config.image,
    url: config.url,
    type: config.type || 'website',
    siteName: config.siteName || 'زهرة الربيع',
  };
}

// دالة لإنشاء structured data محسن باستخدام Schema.org
export function createStructuredData(config: SEOConfig, siteSettings?: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zahret-alrabie.com';
  
  // Organization Schema - أساسي لكل الصفحات
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteSettings?.settings?.companyName || "زهرة الربيع",
    "description": siteSettings?.settings?.description || "زهرة الربيع - شركة رائدة في تقديم الخدمات والمنتجات المتميزة",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": siteSettings?.settings?.icon || `${baseUrl}/icon.png`,
      "width": 512,
      "height": 512
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteSettings?.settings?.phoneNumber || "+966559599296",
      "contactType": "customer service",
      "availableLanguage": ["Arabic", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": siteSettings?.settings?.city || "الرياض",
      "addressCountry": "SA"
    },
    "sameAs": siteSettings?.settings?.socialLinks?.map((link: any) => link.url) || []
  };

  // Website Schema
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteSettings?.settings?.companyName || "زهرة الربيع",
    "description": siteSettings?.settings?.description || "زهرة الربيع - شركة رائدة في تقديم الخدمات والمنتجات المتميزة",
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "name": siteSettings?.settings?.companyName || "زهرة الربيع"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Service Schema (للخدمات)
  if (config.type === 'service') {
    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": config.title,
      "description": config.description,
      "url": config.url || baseUrl,
      "provider": {
        "@type": "Organization",
        "name": siteSettings?.settings?.companyName || "زهرة الربيع"
      },
      "serviceType": config.title,
      "areaServed": {
        "@type": "Country",
        "name": "Saudi Arabia"
      },
      ...(config.image && {
        "image": config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`
      })
    };
    return [organization, website, service];
  }

  // Article Schema (للمقالات)
  if (config.type === 'article') {
    const article = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": config.title,
      "description": config.description,
      "url": config.url || baseUrl,
      "author": {
        "@type": "Organization",
        "name": siteSettings?.settings?.companyName || "زهرة الربيع"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteSettings?.settings?.companyName || "زهرة الربيع",
        "logo": {
          "@type": "ImageObject",
          "url": siteSettings?.settings?.icon || `${baseUrl}/icon.png`
        }
      },
      "datePublished": config.publishedTime || new Date().toISOString(),
      "dateModified": config.modifiedTime || new Date().toISOString(),
      "inLanguage": "ar",
      ...(config.image && {
        "image": config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`
      })
    };
    return [organization, website, article];
  }

  // Product Schema (للمنتجات)
  if (config.type === 'product') {
    const product = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": config.title,
      "description": config.description,
      "url": config.url || baseUrl,
      "brand": {
        "@type": "Brand",
        "name": siteSettings?.settings?.companyName || "زهرة الربيع"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": siteSettings?.settings?.companyName || "زهرة الربيع"
      },
      ...(config.image && {
        "image": config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`
      })
    };
    return [organization, website, product];
  }

  // Default Website Schema
  return [organization, website];
}

// دالة لتحسين meta descriptions
export function optimizeMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) {
    return description;
  }
  
  // إزالة HTML tags
  const cleanDescription = description.replace(/<[^>]*>/g, '');
  
  if (cleanDescription.length <= maxLength) {
    return cleanDescription;
  }
  
  // قطع النص في آخر كلمة كاملة
  const truncated = cleanDescription.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

// دالة لإنشاء keywords من المحتوى
export function generateKeywords(content: string, title: string, additionalKeywords: string[] = []): string[] {
  const commonWords = ['في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي', 'التي', 'التي', 'و', 'أو', 'لكن', 'إذا', 'لأن', 'حيث', 'عندما', 'كيف', 'لماذا', 'أين', 'متى', 'ما', 'من', 'هو', 'هي', 'هم', 'هن', 'أنت', 'أنتم', 'أنتن', 'أنا', 'نحن'];
  
  const words = content
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\s]/g, '') // إزالة الأرقام والرموز
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
  
  const wordCount = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const sortedWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return [...new Set([...sortedWords, ...additionalKeywords])];
}