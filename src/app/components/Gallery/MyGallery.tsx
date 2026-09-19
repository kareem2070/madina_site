"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Gallery = () => {
  const [images, setImages] = useState<{ url: string }[]>([]);
  const [visibleImages, setVisibleImages] = useState<{ url: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const initialLimit = 60;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery");
        const data = await response.json();
        if (Array.isArray(data)) {
          setImages(data);
          setVisibleImages(data.slice(0, initialLimit));
        } else {
          setImages([]);
        }
      } catch (err) {
        console.error("Failed to load images", err);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const handleShowMore = () => {
    const nextImages = images.slice(
      visibleImages.length,
      visibleImages.length + initialLimit
    );
    setVisibleImages((prev) => [...prev, ...nextImages]);
  };

  return (
    <div className="text-center mt-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-center items-center mx-auto">
        {visibleImages.map((image, index) => (
          <div
            key={index.toString()}
            className="cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image.url}
              width={500}
              height={500}
              loading="lazy"
              quality={75}
              alt={`Gallery Image ${index + 1}`}
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
            />
          </div>
        ))}
      </div>

      {visibleImages.length < images.length && (
        <button
          onClick={handleShowMore}
          className="mt-6 px-4 py-2 bg-button text-white rounded-full hover:bg-button-hover transition-colors duration-300"
        >
          عرض المزيد
        </button>
      )}

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map((img) => ({
            src: img.url,
          }))}
        />
      )}
    </div>
  );
};

export default Gallery;
