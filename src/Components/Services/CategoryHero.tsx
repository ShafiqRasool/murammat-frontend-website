import React from 'react';
import { Star, Tag, CheckCircle } from 'lucide-react';

interface CategoryHeroProps {
  // This prop allows the heading to change dynamically based on the clicked category
  categoryName: string; 
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ categoryName }) => {
  return (
    <div className="bg-[#00674F] w-full py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Dynamic Header Section */}
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {categoryName} Services
          </h1>
          <p className="text-lg md:text-xl text-[#E0EFEA]">
            Book Our {categoryName} Services at Most Affordable Price.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="flex flex-wrap gap-4 mt-4">
          
          {/* Rating Card */}
          <div className="bg-white rounded-lg p-4 flex items-center gap-4 flex-1 min-w-[220px] max-w-[300px] shadow-sm">
            <div className="bg-gray-50 p-3 rounded-lg text-[#00674F]">
              <Star className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00674F]">4.5/5</div>
              <div className="text-sm text-gray-500 font-medium">Average rating</div>
            </div>
          </div>

          {/* Starting Price Card */}
          <div className="bg-white rounded-lg p-4 flex items-center gap-4 flex-1 min-w-[220px] max-w-[300px] shadow-sm">
            <div className="bg-gray-50 p-3 rounded-lg text-[#00674F] flex flex-col items-center justify-center font-bold">
               <Tag className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00674F]">20</div>
              <div className="text-sm text-gray-500 font-medium">Start from (RS)</div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-lg p-4 flex items-center gap-4 flex-1 min-w-[220px] max-w-[300px] shadow-sm">
            <div className="bg-gray-50 p-3 rounded-lg text-[#00674F]">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#00674F]">48222</div>
              <div className="text-sm text-gray-500 font-medium">Done order</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryHero;