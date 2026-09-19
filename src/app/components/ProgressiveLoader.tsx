"use client";
import { useEffect, useState } from "react";

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  priority?: boolean;
}

const ProgressiveLoader = ({ 
  children, 
  fallback, 
  delay = 100,
  priority = false 
}: ProgressiveLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(priority);
  const [shouldRender, setShouldRender] = useState(priority);

  useEffect(() => {
    if (priority) return;

    const timer = setTimeout(() => {
      setIsLoaded(true);
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, priority]);

  // تحميل تدريجي للمكونات غير المهمة
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    const element = document.getElementById('progressive-loader');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [priority]);

  if (!shouldRender) {
    return (
      <div id="progressive-loader" className="min-h-[400px] flex items-center justify-center">
        {fallback || (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">جاري التحميل...</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default ProgressiveLoader;
