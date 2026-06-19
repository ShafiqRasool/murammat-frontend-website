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
}

const CategoryServicesGrid: React.FC<CategoryServicesGridProps> = ({ parentId }) => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Services
          </h2>
          <p className="text-[#878787] text-lg max-w-2xl mx-auto">
            Choose from our wide range of services
          </p>
        </div>

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
            <div className="col-span-full text-center text-gray-500 py-10">
              No services found for this category.
            </div>
          ) : (
            subCategories.map((subCat) => (
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
                
                {/* Service Title - Kept the Emerald Green text color change on hover */}
                <h3 className="text-center text-sm md:text-base font-semibold text-gray-800 group-hover:text-[#00674F] transition-colors duration-300">
                  {subCat.name}
                </h3>
              </button>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default CategoryServicesGrid;