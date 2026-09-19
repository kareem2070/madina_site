"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView, initializeTracking } from "@/app/utils/gtm";

/**
 * مكون تتبع Google Tag Manager
 * يتم تضمينه في الـ layout الرئيسي لتتبع جميع الصفحات
 */
export default function GTMTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // تهيئة التتبع عند التحميل الأول
    initializeTracking();
  }, []);

  useEffect(() => {
    // تتبع تغيير الصفحات
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null; // هذا المكون لا يعرض شيء
}


