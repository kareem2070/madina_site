"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface Video {
  url: string;
  thumbnail: string;
}

interface ImageItem {
  url: string;
}

const ProjectsGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // جلب البيانات بشكل متوازي
        const [videosResponse, imagesResponse] = await Promise.all([
          fetch("/api/videos"),
          fetch("/api/gallery")
        ]);

        const [videosData, imagesData] = await Promise.all([
          videosResponse.json(),
          imagesResponse.json()
        ]);

        setVideos(Array.isArray(videosData) ? videosData : []);
        setImages(Array.isArray(imagesData) ? imagesData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageClick = (index: number) => {
    setCurrentSlide(index);
    setLightboxOpen(true);
  };

  const handleVideoClick = (index: number) => {
    // لا نفعل شيء - الفيديو سيشغل مباشرة
    return;
  };

  const getLightboxSlides = () => {
    if (activeTab === 'images') {
      return images.map(img => ({ src: img.url }));
    } else {
      return videos.map(video => ({ 
        src: video.url,
        type: 'video',
        poster: video.thumbnail 
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600 text-sm">جاري تحميل المعرض...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* سويتش التبديل */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 inline-flex">
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeTab === 'images'
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            الصور
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              activeTab === 'videos'
                ? 'bg-primary text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            الفيديوهات
          </button>
        </div>
      </div>

      {/* عرض المحتوى */}
      {activeTab === 'images' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="group cursor-pointer relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={() => handleImageClick(index)}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.url}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="aspect-video relative">
                <video
                  className="w-full h-full object-cover"
                  poster={video.thumbnail}
                  preload="metadata"
                  controls
                  controlsList="nodownload"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={video.url} type="video/mp4" />
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={getLightboxSlides()}
          index={currentSlide}
        />
      )}
    </div>
  );
};

export default ProjectsGallery;