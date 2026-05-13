import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

// Reuse images or define new ones if needed
import applianceRepairImg from '../../assets/LandingPage/appliance-repair.jpg';
import cleaningServicesImg from '../../assets/LandingPage/cleaning-services.jpg';
import electricalServicesImg from '../../assets/LandingPage/electrical-services.jpg';
import plumbingServicesImg from '../../assets/LandingPage/plumbing-services.jpg';
import pestControlImg from '../../assets/LandingPage/pest-control.jpg';
import deepCleaningImg from '../../assets/LandingPage/deep-cleaning.png';

interface SubCategory {
  id: string;
  name: string;
  parent_category_id: string;
}

interface MainCategoriesProps {
  parentId: string;
  onBack: () => void;
}

const MainCategories: React.FC<MainCategoriesProps> = ({ parentId, onBack }) => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await API.get('/public/categories');
        const relatedSubCats = response.data.filter((c: SubCategory) => c.parent_category_id === parentId);
        setSubCategories(relatedSubCats);
      } catch (error) {
        console.error('Failed to fetch sub-categories:', error);
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchSubCategories();
    }
  }, [parentId]);

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
        
        {/* Section Header with Back Button */}
        <div className="flex flex-col items-center mb-12 relative">
          <button 
            onClick={onBack}
            className="absolute left-0 top-0 text-[#00674F] font-semibold hover:underline flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
          
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Select a Category
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              Explore our specific services in this category.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse w-[140px] sm:w-[180px] md:w-[220px] lg:flex-1 min-w-[160px] max-w-[240px] h-[160px] bg-gray-200 rounded-xl"></div>
            ))
          ) : subCategories.length === 0 ? (
            <div className="text-center text-gray-500 py-8 w-full">
              No categories found for this selection.
            </div>
          ) : (
            subCategories.map((category) => (
              <div 
                key={category.id} 
                onClick={() => navigate('/specific-categories', { state: { categoryName: category.name } })}
                className="w-[140px] sm:w-[180px] md:w-[220px] lg:flex-1 min-w-[160px] max-w-[240px] bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,103,79,0.12)] hover:-translate-y-1 hover:border-[#00674F]/30 group"
              >
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

export default MainCategories;
