import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

// Import images
import applianceRepairImg from '../../assets/LandingPage/appliance-repair.jpg';
import cleaningServicesImg from '../../assets/LandingPage/cleaning-services.jpg';
import electricalServicesImg from '../../assets/LandingPage/electrical-services.jpg';
import plumbingServicesImg from '../../assets/LandingPage/plumbing-services.jpg';
import pestControlImg from '../../assets/LandingPage/pest-control.jpg';
import deepCleaningImg from '../../assets/LandingPage/deep-cleaning.png';

export interface ParentCategory {
  id: string;
  name: string;
  description: string;
}

const TopServices: React.FC = () => {
  const navigate = useNavigate();
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/public/parent-categories');
        setParentCategories(response.data.slice(0, 5)); // Keep it to 5 items to match design
      } catch (error) {
        console.error('Failed to fetch parent categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (!loading && parentCategories.length === 0) {
    return null; // Hide section if no parent categories exist
  }

  const getCategoryImage = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('cleaning')) return cleaningServicesImg;
    if (n.includes('maintenance') || n.includes('home')) return applianceRepairImg;
    if (n.includes('female')) return deepCleaningImg;
    if (n.includes('company') || n.includes('maintained')) return electricalServicesImg;
    if (n.includes('pest')) return pestControlImg;
    if (n.includes('plumb')) return plumbingServicesImg;
    return applianceRepairImg; // Fallback
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Our Main Categories
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Murammat.pk provides ultimate installations, repairs, maintenance, and cleaning services right at your doorstep.
          </p>
        </div>

        {/* Services Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse w-[140px] sm:w-[180px] md:w-[220px] lg:flex-1 min-w-[160px] max-w-[240px] h-[160px] bg-gray-200 rounded-xl"></div>
            ))
          ) : (
            parentCategories.map((category) => (
              <div 
                key={category.id} 
                onClick={() => navigate('/specific-categories', { state: { categoryName: category.name, categoryId: category.id } })}
                // Width calculations to ensure they fit nicely across screen sizes.
                className="w-[140px] sm:w-[180px] md:w-[220px] lg:flex-1 min-w-[160px] max-w-[240px] bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,103,79,0.12)] hover:-translate-y-1 hover:border-[#00674F]/30 group"
              >
                {/* Image Container with smooth hover scale effect */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <img 
                    src={getCategoryImage(category.name)} 
                    alt={category.name} 
                    className="w-full h-full object-cover rounded-full shadow-md"
                  />
                </div>
                
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-[#00674F] transition-colors">
                  {category.name}
                </h3>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default TopServices;