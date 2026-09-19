"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaArrowRight } from "react-icons/fa";
import ServiceTracker from "@/app/components/ServiceTracker";

const ServiceDetail = ({ service }: { service: any }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = service.galleryImages
    ? JSON.parse(service.galleryImages)
    : [];

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* تتبع عرض صفحة الخدمة */}
      <ServiceTracker serviceName={service.title} serviceId={service.id} />
      
      {/* Hero Section with Cover Image */}
      <section className="relative h-[70vh] overflow-hidden">
        {service.imagePath && (
          <div className="absolute inset-0">
            <Image
              src={service.imagePath}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
        )}
        
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 pb-20">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {parse(service.content)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-orange-500/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختارنا؟</h2>
              <p className="text-xl text-gray-600">نقدم أفضل الخدمات بأعلى معايير الجودة</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "🎯", title: "دقة في التنفيذ", desc: "نلتزم بأعلى معايير الجودة في كل مشروع" },
                { icon: "⚡", title: "سرعة في التسليم", desc: "نحترم مواعيد التسليم المتفق عليها" },
                { icon: "💎", title: "جودة المواد", desc: "نستخدم أفضل المواد والأدوات المتاحة" },
                { icon: "🛡️", title: "ضمان الجودة", desc: "نقدم ضمان شامل على جميع أعمالنا" },
                { icon: "👥", title: "فريق متخصص", desc: "فريق من الخبراء في مجال تنسيق الحدائق" },
                { icon: "📞", title: "دعم مستمر", desc: "نقدم الدعم والاستشارة بعد التسليم" }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">معرض الصور</h2>
                <p className="text-xl text-gray-600">اكتشف جمال أعمالنا من خلال معرض الصور</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Gallery Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 rounded-full p-4">
                          <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">هل أنت مستعد لبدء مشروعك؟</h2>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              className="inline-flex items-center gap-3 bg-gray-100 text-gray-800 py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-200"
              href="/services"
            >
              <FaArrowRight className="w-5 h-5" />
              رجوع إلى جميع الخدمات
            </Link>
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={galleryImages.map((img: string) => ({ src: img }))}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
