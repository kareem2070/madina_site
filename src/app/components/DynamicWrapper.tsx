// app/components/DynamicWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import SEOOptimizedLoader from "./SEOOptimizedLoader";

export const DynamicProducts = dynamic(
  () => import("@/app/sections/Products").catch(() => ({ default: () => <div>Error loading products</div> })),
  {
    ssr: false,
    loading: () => <SEOOptimizedLoader message="جاري تحميل المنتجات..." />,
  }
);

export const DynamicServices = dynamic(
  () => import("@/app/sections/services").catch(() => ({ default: () => <div>Error loading services</div> })),
  {
    ssr: false,
    loading: () => <SEOOptimizedLoader message="جاري تحميل الخدمات..." />,
  }
);

export const DynamicPortfolio = dynamic(
  () => import("@/app/sections/portfolio").catch(() => ({ default: () => <div>Error loading portfolio</div> })),
  {
    ssr: false,
    loading: () => <SEOOptimizedLoader message="جاري تحميل المشاريع..." />,
  }
);

export const DynamicCustomer = dynamic(
  () => import("@/app/sections/customer").catch(() => ({ default: () => <div>Error loading reviews</div> })),
  {
    ssr: false,
    loading: () => <SEOOptimizedLoader message="جاري تحميل آراء العملاء..." />,
  }
);

export const DynamicBlogPostsSlider = dynamic(
  () => import("@/app/components/BlogPostsSlider").catch(() => ({ default: () => <div>Error loading blog posts</div> })),
  {
    ssr: false,
    loading: () => <SEOOptimizedLoader message="جاري تحميل المقالات..." />,
  }
);
