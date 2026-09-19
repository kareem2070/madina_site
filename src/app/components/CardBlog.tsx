// components/CardBlog.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FaUserAlt, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description?: string;
  author: string;
  coverImage?: string;
  createdAt: string;
}

export default function CardBlog({ post }: { post: BlogPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link
        href={`/blog/${encodeURIComponent(post.slug)}`}
        className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
      >
        {/* Image container */}
        <div className="relative overflow-hidden">
          {post.coverImage && (
            <Image
              width={640}
              height={320}
              src={post.coverImage}
              alt={post.title}
              className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Read more indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaArrowLeft className="text-primary text-sm" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
            {post.description || "لا يوجد وصف"}
          </p>
          
          {/* Meta information */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-gray-500 text-sm">
              <FaCalendarAlt className="ml-2 text-primary" />
              <span>
                {new Date(post.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <FaUserAlt className="ml-2 text-primary" />
              <span>بواسطة {post.author}</span>
            </div>
          </div>
          
          {/* Read more button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-primary font-medium text-sm group-hover:text-secondary transition-colors duration-300">
              اقرأ المزيد
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
