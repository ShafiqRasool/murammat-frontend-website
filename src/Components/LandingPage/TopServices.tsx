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
  image_url?: string;
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

  const getImageUrl = (url?: string, name?: string) => {
    if (!url) return getCategoryImage(name || '');
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
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
              <div key={i} className="animate-pulse w-[150px] sm:w-[190px] md:w-[230px] lg:flex-1 min-w-[170px] max-w-[240px] h-[220px] bg-gray-200 rounded-2xl"></div>
            ))
          ) : (
            parentCategories.map((category) => (
              <div 
                key={category.id} 
                onClick={() => navigate('/specific-categories', { state: { categoryName: category.name, categoryId: category.id } })}
                className="w-[150px] sm:w-[190px] md:w-[230px] lg:flex-1 min-w-[170px] max-w-[240px] bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,103,79,0.12)] hover:-translate-y-2 hover:border-[#00674F]/30 group flex flex-col"
              >
                {/* Square Image Container */}
                <div className="w-full aspect-square overflow-hidden bg-gray-50 relative">
                  <img 
                    src={getImageUrl(category.image_url, category.name)} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-4 flex-grow flex items-center justify-between min-h-[60px] bg-white border-t border-gray-50">
                  <h3 className="text-xs sm:text-sm font-extrabold text-gray-800 group-hover:text-[#00674F] transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <span className="text-gray-400 group-hover:text-[#00674F] group-hover:translate-x-1.5 transition-all duration-300 transform text-sm pl-2">
                    ➔
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default TopServices;