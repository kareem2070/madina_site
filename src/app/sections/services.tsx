"use client";
import Card from "../components/card/Card";
import TitleSection from "../components/Title-Section/Title-Section";
import { motion } from "framer-motion";

export default function ServicesSection(params: any) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.section 
      className={`py-16 ${params.color}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="container mx-auto w-full">
        <motion.div variants={itemVariants}>
          <TitleSection title="الخدمات" />
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-8"
        >
          <Card />
        </motion.div>
      </div>
    </motion.section>
  );
}
