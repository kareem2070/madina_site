"use client";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 pt-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-100 opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Page Title */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Page Description */}
          {description && (
            <motion.p 
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}

          {/* Decorative Line */}
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
