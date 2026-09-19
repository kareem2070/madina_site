"use client";
import { useEffect, useState } from "react";

interface PerformanceLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const PerformanceLoader = ({ 
  message = "جاري التحميل...", 
  size = "md",
  className = ""
}: PerformanceLoaderProps) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4`}></div>
      <p className={`text-gray-600 ${textSizeClasses[size]} font-medium`}>
        {message}{dots}
      </p>
    </div>
  );
};

export default PerformanceLoader;


