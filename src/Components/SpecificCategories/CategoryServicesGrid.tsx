import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

interface SubCategory {
  id: string;
  name: string;
  parent_category_id: string;
  image_url?: string;
}

interface CategoryServicesGridProps {
  parentId?: string | null;
  parentCategoryName?: string;
}

const CategoryServicesGrid: React.FC<CategoryServicesGridProps> = ({ parentId, parentCategoryName }) => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [resolvedParentName, setResolvedParentName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (parentCategoryName) {
      setResolvedParentName(parentCategoryName);
    } else if (parentId) {
      API.get('/public/parent-categories')
        .then(res => {
          const found = res.data.find((p: any) => p.id === parentId);
          if (found) setResolvedParentName(found.name);
        })
        .catch(() => {});
    }
  }, [parentId, parentCategoryName]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        const response = await API.get('/public/categories');
        let filteredCats = response.data;
        if (parentId) {
          filteredCats = response.data.filter((c: SubCategory) => c.parent_category_id === parentId);
        } else {
          // If no parentId is provided, you might want to show all or limit them
          // For now, we'll show a limited amount of all subcategories as fallback
          filteredCats = response.data.slice(0, 12);
        }
        setSubCategories(filteredCats);
      } catch (error) {
        console.error('Failed to fetch sub-categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [parentId]);

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://via.placeholder.com/150?text=No+Image';
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  return (
    <section className="w-full py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section - Only shown when we have subcategories */}
        {subCategories.length > 0 && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              Services
            </h2>
            <p className="text-[#878787] text-lg max-w-2xl mx-auto">
              Choose from our wide range of services
            </p>
          </div>
        )}

        {/* Dynamic Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex flex-col items-center p-4">
                <div className="w-20 h-20 bg-gray-100 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 w-24 rounded"></div>
              </div>
            ))
          ) : subCategories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-20 h-20 bg-[#E6F0ED] rounded-full flex items-center justify-center text-[#00674F] animate-pulse">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="36" height="36">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{resolvedParentName || 'Services'} Coming Soon!</h2>
              <p className="text-[#878787] max-w-sm leading-relaxed text-sm">
                We are currently expanding our catalogue. {resolvedParentName || 'Services'} are under way!
              </p>
              <button 
                onClick={() => navigate('/')} 
                className="mt-4 px-8 py-3 bg-gradient-to-r from-[#00674F] to-[#00a87a] text-white font-bold rounded-xl shadow-lg shadow-[#00674F]/20 hover:shadow-xl hover:shadow-[#00a87a]/30 transition-all active:scale-[0.98] cursor-pointer"
              >
                Request a Callback
              </button>
            </div>
          ) : (
            <>
              {subCategories.map((subCat) => (
                <button
                  key={subCat.id}
                  onClick={() => navigate(`/subcategory/${subCat.id}/services`)}
                  className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-[#FAFAFA] hover:shadow-md hover:shadow-emerald-900/5 border border-transparent hover:border-gray-100"
                >
                  <div className="w-20 h-20 mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <img 
                      src={getImageUrl(subCat.image_url)} 
                      alt={subCat.name} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  
                  {/* Service Title */}
                  <h3 className="text-center text-sm md:text-base font-semibold text-gray-800 group-hover:text-[#00674F] transition-colors duration-300">
                    {subCat.name}
                  </h3>
                </button>
              ))}

              {/* Custom Coming Soon Card alongside Subcategories */}
              <button
                onClick={() => navigate('/')}
                className="group flex flex-col items-center p-4 rounded-3xl transition-all duration-300 hover:bg-[#FAFAFA] hover:shadow-lg hover:shadow-emerald-900/5 border border-transparent hover:border-gray-100/50"
              >
                {/* Modern Premium Logo/Icon Container */}
                <div className="w-20 h-20 mb-4 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105">
                  {/* Outer glowing ring */}
                  <div className="absolute inset-0 bg-[#E6F0ED] rounded-2xl border border-dashed border-[#00674F]/20 animate-pulse"></div>
                  
                  {/* Inner floating circle with gradient */}
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#00674F] to-[#00a87a] rounded-xl flex items-center justify-center shadow-md shadow-[#00674F]/10 relative z-10 transform group-hover:rotate-6 transition-transform duration-300">
                    {/* Combined Clock & Sparkle SVG */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6 text-white">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={2} />
                      <path d="M12 8v4l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="19" cy="5" r="1.5" fill="#00ffc4" stroke="none" />
                      <circle cx="5" cy="19" r="1.5" fill="#00ffc4" stroke="none" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-center text-sm font-bold text-gray-700 group-hover:text-[#00674F] transition-colors duration-300 leading-snug max-w-[130px]">
                  More <span className="text-[#00674F] font-semibold">{resolvedParentName || 'Services'}</span> Coming Soon
                </h3>
              </button>
            </>
          )}
        </div>

      </div>
    </section>
  );
};

export default CategoryServicesGrid;