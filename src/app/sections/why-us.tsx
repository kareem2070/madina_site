"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/Button/button";
import TitleSection from "../components/Title-Section/Title-Section";

const WhyUs = () => {
  const [whyUs, setWhyUs] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchWhyUs = async () => {
      try {
        const response = await fetch("/api/why-us");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setWhyUs({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchWhyUs();
  }, []);

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

  const titleVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section 
      id="why-us" 
      className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="container mx-auto relative z-10">
        <motion.div variants={itemVariants}>
          <TitleSection title="لماذا نحن؟" />
        </motion.div>
        
        <motion.h3 
          className="text-4xl md:text-5xl text-center text-primary font-bold py-8 leading-tight"
          variants={titleVariants}
        >
          {whyUs.title}
        </motion.h3>
        
        <motion.p 
          className="text-lg md:text-xl text-center text-gray-700 w-full md:max-w-4xl mx-auto leading-relaxed"
          variants={descriptionVariants}
        >
          {whyUs.description}
        </motion.p>
        
        <motion.div 
          className="btn flex justify-center items-center mt-8"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <Button />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyUs;
