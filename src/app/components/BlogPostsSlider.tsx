// components/BlogPostsSlider.tsx
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CardBlog from "@/app/components/CardBlog";
import TitleSection from "./Title-Section/Title-Section";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  coverImage?: string;
  createdAt: string;
}

interface BlogPostsSliderProps {
  posts: BlogPost[];
}

export default function BlogPostsSlider({ posts }: BlogPostsSliderProps) {
  if (!posts || posts.length === 0) {
    return null; // أو عرض رسالة "لا توجد مقالات"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section 
      className="bg-gradient-to-br from-gray-50 to-white relative overflow-hidden py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-40 translate-x-40"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full translate-y-36 -translate-x-36"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div variants={itemVariants}>
          <TitleSection title="أحدث المقالات" />
        </motion.div>
        
        <motion.div 
          className="mt-12"
          variants={itemVariants}
        >
          <Swiper
            className="!pb-16"
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            dir="rtl"
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <CardBlog post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </motion.section>
  );
}

// تصدير النوع للاستخدام في المكونات الأخرى
export type { BlogPost, BlogPostsSliderProps };
