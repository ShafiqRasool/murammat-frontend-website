import React, { useState, useEffect } from 'react';
import { BadgeCheck, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// 1. Define the interface for the API data structure
export interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  isVerified: boolean;
}

// 2. STATIC DATA (Fallback)
const staticReviews: Review[] = [
  {
    id: 1,
    name: 'Naeem .',
    location: 'Lahore',
    text: 'I m satisfied work off Murammat tech ,good job',
    isVerified: true,
  },
  {
    id: 2,
    name: 'Ahsan .',
    location: 'Lahore',
    text: 'excellent service by these two young professionals. they handled the work very nicely and I would highly recommend them in the future.',
    isVerified: true,
  },
  {
    id: 3,
    name: 'Abdul Ghani .',
    location: 'Lahore',
    text: 'Very Nice and Cooperative Guy, Impressive',
    isVerified: true,
  },
  {
    id: 4,
    name: 'Shoaib .',
    location: 'Lahore',
    text: 'I am too much satisfied with Murammat Electrician Services, Great work Murammat.',
    isVerified: true,
  },
  {
    id: 5,
    name: 'Abdullah Bin Laique .',
    location: 'Lahore',
    text: 'Perfect service over all, 100% satisfied, thanks Mr.Ijaz',
    isVerified: true,
  },
];

interface CustomerReviewsProps {
  reviews?: Review[]; 
  title?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviews = staticReviews, 
  title = "What Our Customers Say" 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [visibleCards, reviews.length]);

  const maxIndex = Math.max(0, reviews.length - visibleCards);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-4 sm:px-6 lg:px-8 antialiased border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header with Slide Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {title}
            </h2>
            <div className="w-20 h-1.5 bg-[#00674F] rounded-full sm:mx-0 mx-auto"></div>
          </div>

          {/* Navigation Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-3">
              <button 
                onClick={prevSlide}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00674F] hover:border-transparent transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Previous Review"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextSlide}
                className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#00674F] hover:border-transparent transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Next Review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport Container */}
        <div className="relative w-full overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` 
            }}
          >
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="flex-shrink-0 px-3 w-full transition-all duration-300"
                style={{ 
                  width: `${100 / visibleCards}%` 
                }}
              >
                <div className="relative bg-white rounded-xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group h-full flex flex-col justify-between min-h-[220px]">
                  {/* Subtle Quote Icon in Background */}
                  <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-50 opacity-50 rotate-12 transition-transform group-hover:scale-110 group-hover:text-[#00674F]/5" />

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed italic mb-6 relative z-10">
                    "{review.text}"
                  </p>

                  {/* Card Footer: Name & Location */}
                  <div className="flex justify-between items-center relative z-10 pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 text-base">
                      {review.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 bg-[#00674F]/5 px-2.5 py-1 rounded-full">
                      {review.isVerified && (
                        <BadgeCheck size={14} className="text-[#00674F]" strokeWidth={2.5} />
                      )}
                      <span className="text-[10px] font-bold text-gray-600 tracking-wide uppercase">
                        {review.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-6 bg-[#00674F]' 
                    : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default CustomerReviews;