"use client";
import ProjectsGallery from "../components/Projects/ProjectsGallery";
import TitleSection from "../components/Title-Section/Title-Section";
import { motion } from "framer-motion";

export default function Portfolio({ color }: { color: string }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className={`container mx-auto py-16 ${color}`}>
        <motion.div 
          variants={itemVariants}
          className="mt-8"
        >
          <ProjectsGallery />
        </motion.div>
      </div>
    </motion.section>
  );
}
