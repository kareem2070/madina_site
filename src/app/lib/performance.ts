// ملف تحسين الأداء
export const performanceConfig = {
  // إعدادات الصور
  image: {
    quality: 85,
    formats: ['image/webp', 'image/avif'],
    sizes: {
      mobile: '(max-width: 768px) 100vw',
      tablet: '(max-width: 1200px) 50vw',
      desktop: '33vw'
    }
  },
  
  // إعدادات التخزين المؤقت
  cache: {
    static: 31536000, // سنة واحدة
    api: 300, // 5 دقائق
    revalidate: 60 // دقيقة واحدة
  },
  
  // إعدادات التحسين
  optimization: {
    lazyLoading: true,
    preloadCritical: true,
    minifyCSS: true,
    minifyJS: true
  }
};

// دالة لتحسين الصور
export const optimizeImageSrc = (src: string, width?: number, quality?: number) => {
  if (!src) return '';
  
  // إذا كانت الصورة من Next.js Image، أضف معاملات التحسين
  if (src.startsWith('/') || src.includes('localhost')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (quality) params.append('q', quality.toString());
    
    const queryString = params.toString();
    return queryString ? `${src}?${queryString}` : src;
  }
  
  return src;
};

// دالة لتحديد أولوية التحميل
export const shouldPreload = (path: string) => {
  const criticalPaths = ['/hero', '/navbar', '/footer'];
  return criticalPaths.some(criticalPath => path.includes(criticalPath));
};

// دالة لتحسين حجم النص
export const optimizeText = (text: string, maxLength: number = 160) => {
  if (!text) return '';
  
  // إزالة HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // تقصير النص إذا كان طويلاً
  if (cleanText.length <= maxLength) return cleanText;
  
  return cleanText.substring(0, maxLength).trim() + '...';
};

// دالة لتحسين استعلامات قاعدة البيانات
export const optimizeQuery = {
  // جلب البيانات الأساسية فقط
  select: {
    id: true,
    title: true,
    description: true,
    imagePath: true,
    createdAt: true,
  },
  
  // ترتيب البيانات
  orderBy: {
    createdAt: 'desc' as const,
  },
  
  // تحديد عدد النتائج
  take: 10,
};

// دالة لتحسين CSS
export const optimizeCSS = {
  // إزالة CSS غير المستخدم
  purge: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // تحسين CSS
  optimize: true,
  
  // ضغط CSS
  minify: true,
};


