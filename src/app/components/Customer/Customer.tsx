"use client";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";
import "react-alice-carousel/lib/alice-carousel.css";
import useSWR from "swr";
import { FaStar, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const AliceCarousel = dynamic(() => import("react-alice-carousel"), {
  ssr: false,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Customer = () => {
  const { data: reviews, error } = useSWR("/api/customer-reviews", fetcher);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1024px)" });

  if (error) {
    return <div>Failed to load reviews</div>;
  }

  if (!reviews) {
    return <div>Loading...</div>;
  }

  const responsiveItems = {
    0: {
      items: 1,
    },
    1024: {
      items: 3,
    },
    3000: {
      items: 4,
    },
  };

  const items = reviews.map((review: any) => (
    <div
      className="my-10 item mx-3 transition-all duration-300 hover:-translate-y-1"
      data-value={review.id}
      key={review.id}
    >
      <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 relative overflow-hidden group">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        
        {/* Quote icon */}
        <div className="absolute top-6 left-6 text-primary/20 text-4xl">
          <FaQuoteLeft />
        </div>
        
        {/* Customer info */}
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {review.region}
            </span>
            <div className="flex">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
              {[...Array(5 - review.rating)].map((_, i) => (
                <FaStar key={i} className="text-gray-300 text-sm" />
              ))}
            </div>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            {review.customerName}
          </h4>
        </div>
        
        {/* Review text */}
        <div className="relative z-10">
          <p className="text-gray-700 text-center leading-relaxed line-clamp-4 mb-6">
            {review.review}
          </p>
          
          {/* Quote icon at bottom */}
          <div className="flex justify-end text-primary/20 text-2xl">
            <FaQuoteRight />
          </div>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      </div>
    </div>
  ));

  return (
    <div className="gallery">
      <AliceCarousel
        autoPlay
        items={items}
        autoPlayInterval={3000}
        responsive={responsiveItems}
        infinite
        disableButtonsControls
        animationDuration={1000}
      />
    </div>
  );
};

export default Customer;
