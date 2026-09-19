"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchServices } from "@/app/lib/action";

const Card = () => {
  const [services, setServices] = useState<
    {
      id: number;
      title: string;
      description: string;
      imagePath: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        setLoading(true);
        const response = await fetchServices();
        setServices(response);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-sm">جاري تحميل الخدمات...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
    >
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          variants={cardVariants}
        >
          <Link
            href={`/services/${encodeURIComponent(
              service.title.replace(/ /g, "-")
            )}`}
            className="group block"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={service.imagePath || "/placeholder-service.jpg"}
                  width={400}
                  height={300}
                  alt={service.title}
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {service.description}
                </p>
                
                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold text-sm group-hover:text-orange-600 transition-colors duration-300">
                    عرض التفاصيل
                  </span>
                  <div className="bg-primary group-hover:bg-orange-600 rounded-full p-2 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Card;
