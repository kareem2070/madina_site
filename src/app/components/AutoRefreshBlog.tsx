'use client';

import { useEffect } from 'react';

interface AutoRefreshBlogProps {
  onRefresh: () => void;
  interval?: number; // بالثواني
}

export default function AutoRefreshBlog({ onRefresh, interval = 30 }: AutoRefreshBlogProps) {
  useEffect(() => {
    // تحديث تلقائي كل فترة محددة
    const autoRefreshInterval = setInterval(() => {
      onRefresh();
    }, interval * 1000);

    // تحديث عند العودة للتبويب
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        onRefresh();
      }
    };

    // تحديث عند التركيز على النافذة
    const handleFocus = () => {
      onRefresh();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(autoRefreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onRefresh, interval]);

  return null; // هذا المكون لا يعرض أي شيء
}
