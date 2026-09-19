'use client';

import { useState, useEffect } from 'react';

interface BlogNotificationProps {
  onNewPost?: () => void;
}

export default function BlogNotification({ onNewPost }: BlogNotificationProps) {
  const [notification, setNotification] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // محاكاة استقبال إشعار عند إضافة مقالة جديدة
    const handleNewPost = () => {
      setNotification('تم إضافة مقالة جديدة!');
      setShowNotification(true);
      
      // إخفاء الإشعار بعد 5 ثوان
      setTimeout(() => {
        setShowNotification(false);
        setTimeout(() => setNotification(null), 300);
      }, 5000);
      
      // استدعاء callback إذا كان متوفراً
      if (onNewPost) {
        onNewPost();
      }
    };

    // الاستماع لتغييرات localStorage (يمكن استخدامها من لوحة التحكم)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'newBlogPost' && e.newValue) {
        handleNewPost();
        // مسح الإشعار من localStorage
        localStorage.removeItem('newBlogPost');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onNewPost]);

  if (!showNotification || !notification) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <span className="text-xl">📝</span>
        <span>{notification}</span>
        <button
          onClick={() => setShowNotification(false)}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
