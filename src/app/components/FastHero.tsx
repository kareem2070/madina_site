"use client";
import { useEffect, useState } from "react";
import OptimizedImage from "./OptimizedImage";

interface FastHeroProps {
  hero: {
    id: number;
    title: string;
    description: string;
    imagePath: string;
  } | null;
}

const FastHero = ({ hero }: FastHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // تحميل فوري للمحتوى المهم
    setIsVisible(true);
  }, []);

  if (!hero) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">زهرة الربيع</h1>
          <p className="text-xl mb-8">شركة رائدة في تقديم الخدمات والمنتجات المتميزة</p>
          <a 
            href="/contact" 
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            تواصل معنا
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white relative overflow-hidden">
      {/* Background Image */}
      {hero.imagePath && (
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={hero.imagePath}
            alt={hero.title}
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-20"
            priority={true}
            quality={90}
          />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {hero.title}
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
          {hero.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/services" 
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          >
            خدماتنا
          </a>
          <a 
            href="/contact" 
            className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            تواصل معنا
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default FastHero;
