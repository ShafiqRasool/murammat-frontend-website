import React from 'react';
import { BadgeCheck, Quote } from 'lucide-react';

// 1. Define the interface for the API data structure
export interface Review {
  id: number;
  name: string;
  location: string;
  text: string;
  isVerified: boolean;
}

// 2. STATIC DATA (Fallback)
// You will remove or ignore this once you hook up your Node.js API
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
  // The component accepts an optional array of reviews from your API
  reviews?: Review[]; 
  title?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ 
  reviews = staticReviews, // Defaults to static data if no API data is passed
  title = "What Our Customers Say" 
}) => {
  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-4 sm:px-6 lg:px-8 antialiased border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {title}
          </h2>
          <div className="w-20 h-1.5 bg-[#00674F] mx-auto rounded-full"></div>
        </div>

        {/* Reviews Masonry/Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="relative bg-white rounded-xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
            >
              {/* Subtle Quote Icon in Background */}
              <Quote className="absolute top-4 right-4 w-12 h-12 text-gray-50 opacity-50 rotate-12 transition-transform group-hover:scale-110 group-hover:text-[#00674F]/5" />

              {/* Card Header: Name & Location */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="font-bold text-gray-900 text-lg">
                  {review.name}
                </h3>
                
                <div className="flex items-center gap-1.5 bg-[#00674F]/5 px-2.5 py-1 rounded-full">
                  {review.isVerified && (
                    <BadgeCheck size={16} className="text-[#00674F]" strokeWidth={2.5} />
                  )}
                  <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                    {review.location}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm md:text-base leading-relaxed relative z-10">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;