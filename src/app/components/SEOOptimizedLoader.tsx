import React from 'react';

interface SEOOptimizedLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SEOOptimizedLoader: React.FC<SEOOptimizedLoaderProps> = ({ 
  message = "جاري التحميل...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8" role="status" aria-label="جاري التحميل">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-blue-600`}></div>
      <p className="mt-4 text-gray-600 text-sm" aria-live="polite">
        {message}
      </p>
    </div>
  );
};

export default SEOOptimizedLoader;
