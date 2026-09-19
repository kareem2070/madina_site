// أداة للتحقق من صحة Structured Data
export function validateStructuredData(data: any): boolean {
  try {
    // التحقق من وجود @context و @type
    if (!data['@context'] || !data['@type']) {
      return false;
    }

    // التحقق من أن @context هو schema.org
    if (data['@context'] !== 'https://schema.org') {
      return false;
    }

    // التحقق من الأنواع المدعومة
    const supportedTypes = [
      'Organization',
      'WebSite',
      'Service',
      'Article',
      'Product',
      'ContactPoint',
      'PostalAddress',
      'ImageObject',
      'SearchAction',
      'EntryPoint'
    ];

    if (!supportedTypes.includes(data['@type'])) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating structured data:', error);
    return false;
  }
}

// دالة لإنشاء BreadcrumbList Schema
export function createBreadcrumbSchema(items: Array<{name: string, url: string}>): any {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// دالة لإنشاء FAQ Schema
export function createFAQSchema(faqs: Array<{question: string, answer: string}>): any {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// دالة لإنشاء LocalBusiness Schema
export function createLocalBusinessSchema(businessData: {
  name: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website: string;
  openingHours?: string[];
  priceRange?: string;
}): any {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessData.name,
    "description": businessData.description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address,
      "addressCountry": "SA"
    },
    "telephone": businessData.phone,
    "email": businessData.email,
    "url": businessData.website,
    "openingHours": businessData.openingHours,
    "priceRange": businessData.priceRange
  };
}
