'use client';

import { useState, useEffect } from 'react';
import CardBlog from './CardBlog';
import AutoRefreshBlog from './AutoRefreshBlog';
import BlogNotification from './BlogNotification';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  coverImage?: string;
  createdAt: string;
}

interface BlogPostsClientProps {
  initialPosts: BlogPost[];
}

export default function BlogPostsClient({ initialPosts }: BlogPostsClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب المقالات من API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/blog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // منع التخزين المؤقت
      });

      if (!response.ok) {
        throw new Error('فشل في جلب المقالات');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // تحديث المقالات عند تحميل المكون
  useEffect(() => {
    fetchPosts();
  }, []);

  // إضافة event listener لتحديث المقالات عند إضافة مقالة جديدة
  useEffect(() => {
    const handleStorageChange = () => {
      fetchPosts();
    };

    // الاستماع لتغييرات localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // الاستماع لتحديثات من نفس التبويب
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">لا توجد مقالات متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <BlogNotification onNewPost={fetchPosts} />
      <AutoRefreshBlog onRefresh={fetchPosts} interval={30} />
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">المدونة</h1>
          <p className="text-gray-600 mt-1">عدد المقالات: {posts.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}</span>
          <button
            onClick={fetchPosts}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            title="تحديث المقالات"
            disabled={loading}
          >
            {loading ? '⏳' : '🔄'} تحديث
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <CardBlog key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
