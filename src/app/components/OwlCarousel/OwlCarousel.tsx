"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import "react-alice-carousel/lib/alice-carousel.css";

const AliceCarousel = dynamic(() => import("react-alice-carousel"), {
  ssr: false,
});

const MyCarousel = () => {
  const [videos, setVideos] = useState<{ url: string; thumbnail: string }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  // تحسين استخدام useEffect بتحميل البيانات باستخدام useCallback
  const fetchVideos = useCallback(async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      if (Array.isArray(data)) {
        setVideos(data);
      } else {
        setVideos([]);
      }
    } catch (err) {
      setError("Failed to load videos");
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  const responsiveItems = {
    0: { items: 1 },
    1024: { items: 3 },
    3000: { items: 4 },
  };

  const items = videos.map((video, index) => (
    <div
      className="my-10 item h-56 mx-3 rounded-lg overflow-hidden"
      data-value={index + 1}
      key={index.toString()}
    >
      <video
        width="320"
        height="240"
        controls
        className="tracking-wide w-full h-full bg-black"
        preload="none"
        // تحميل الفيديو عند التفاعل فقط
      >
        <source src={video.url} type="video/mp4" />
        <track
          src={`${video.url}.vtt`}
          kind="captions"
          srcLang="en"
          label="English"
        />
      </video>
    </div>
  ));

  return (
    <div className="gallery">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {videos.length > 0 ? (
        <AliceCarousel
          autoPlay
          items={items}
          autoPlayInterval={3000}
          responsive={responsiveItems}
          infinite
          disableButtonsControls
          animationDuration={1000}
        />
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default MyCarousel;
