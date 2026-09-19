"use client";
import Image from "next/image";
import TitleSection from "../components/Title-Section/Title-Section";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AboutUs {
  id: number;
  title: string;
  description: string;
  imagePath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AboutProps {
  aboutUs: AboutUs;
}

const About = ({ aboutUs }: AboutProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0
    },
    hover: {
      scale: 1.05,
      rotate: 3
    }
  };


  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="py-16 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="about-us flex flex-col-reverse lg:flex-row items-center gap-12"
          variants={itemVariants}
        >
          {/* Content Section */}
          <motion.div 
            className="content w-full lg:w-3/5 space-y-8"
            variants={itemVariants}
          >
            <TitleSection title="من نحن" />

            <motion.h2 
              className="text-3xl md:text-5xl text-gray-900 font-bold leading-tight"
              variants={itemVariants}
            >
              {aboutUs.title}
            </motion.h2>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-700 leading-relaxed"
              variants={itemVariants}
            >
              {aboutUs.description}
            </motion.p>
            
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full"
              variants={itemVariants}
            />
            
            {/* Statistics Counter */}
            <motion.div 
              className="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
              variants={itemVariants}
            >
              {/* Projects Completed */}
              <motion.div 
                className="stat-item group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Counter end={150} />
                  </motion.div>
                  <p className="text-gray-600 font-medium">مشروع مكتمل</p>
                </div>
              </motion.div>
              
              {/* Happy Clients */}
              <motion.div 
                className="stat-item group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Counter end={340} />
                  </motion.div>
                  <p className="text-gray-600 font-medium">عميل راضي</p>
                </div>
              </motion.div>
              
              {/* Years Experience */}
              <motion.div 
                className="stat-item group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Counter end={10} />
                  </motion.div>
                  <p className="text-gray-600 font-medium">سنوات خبرة</p>
                </div>
              </motion.div>
              
              {/* Available Services */}
              <motion.div 
                className="stat-item group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  y: -2,
                  transition: { duration: 0.3 }
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4 mx-auto group-hover:bg-primary/20 transition-colors duration-300">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <motion.div 
                    className="text-3xl font-bold text-primary mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <Counter end={12} />
                  </motion.div>
                  <p className="text-gray-600 font-medium">خدمة متاحة</p>
                </div>
              </motion.div>
            </motion.div>
            
          </motion.div>

          {/* Image Section */}
          <motion.div 
            className="image w-full lg:w-2/5 flex justify-center"
            variants={imageVariants}
            whileHover="hover"
          >
            {aboutUs.imagePath && (
              <motion.div
                className="relative"
                whileHover={{ 
                  scale: 1.05,
                  rotate: 3,
                  transition: { duration: 0.3 }
                }}
              >
                <Image
                  className="rounded-3xl shadow-2xl shadow-gray-900/20"
                  src={
                    aboutUs.imagePath.startsWith("/")
                      ? aboutUs.imagePath
                      : `/${aboutUs.imagePath}`
                  }
                  alt={aboutUs.title}
                  width={500}
                  height={500}
                />
                {/* Decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Counter Component with Animation
const Counter = ({ end }: { end: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
        setHasAnimated(true);
      }
    };

    // Start animation after a short delay
    const timer = setTimeout(() => {
      updateCount();
    }, 500);

    return () => clearTimeout(timer);
  }, [end, hasAnimated]);

  return <span>{count}</span>;
};

export default About;