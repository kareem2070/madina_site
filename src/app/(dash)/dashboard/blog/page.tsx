"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  description: string; // أضف هذا السطر
  slug: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export default function BlogDashboard() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await res.json();
        setBlogPosts(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا المنشور؟")) {
      const res = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogPosts(blogPosts.filter((post) => post.slug !== slug));
      } else {
        console.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="w-full mx-auto py-10 text-center bg-gray-100">
      <h3 className="text-3xl font-bold text-blue-200 bg-blue-900 rounded-lg py-5 mx-6">
        إدارة المدونة
      </h3>
      <div className="flex justify-between items-center mb-6 mt-6 mx-6">
        <h1 className="text-2xl font-bold">المنشورات</h1>
        <Link
          href="/dashboard/blog/create"
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          إنشاء منشور جديد
        </Link>
      </div>
      {isLoading ? (
        <p className="text-lg text-blue-600">جاري التحميل...</p>
      ) : blogPosts.length > 0 ? (
        <table className="min-w-full bg-white shadow-sm shadow-blue-500 rounded-lg mx-6">
          <thead>
            <tr className="bg-blue-200">
              <th className="py-3 px-4 border-b">العنوان</th>
              <th className="py-3 px-4 border-b">الكاتب</th>
              <th className="py-3 px-4 border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {blogPosts.map((post) => (
              <tr
                key={post.id}
                className="hover:bg-gray-100 transition duration-150"
              >
                <td className="py-3 px-4 border-b">{post.title}</td>
                <td className="py-3 px-4 border-b">{post.author}</td>
                <td className="py-3 px-4 border-b flex justify-center gap-4">
                  <Link
                    href={`/dashboard/blog/edit/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-red-600">لا توجد منشورات حالياً.</p>
      )}
    </div>
  );
}
