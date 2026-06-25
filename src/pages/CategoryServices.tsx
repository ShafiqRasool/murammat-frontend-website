import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import API from '../utils/api';

interface SubCategory {
  id: string;
  name: string;
  parent_category_id: string;
}

interface Service {
  id: string;
  name: string;
  category_id: string;
  base_price: number;
}

const CategoryServices: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch sub-categories
        const catRes = await API.get('/public/categories');
        const relatedSubCats = catRes.data.filter((c: SubCategory) => c.parent_category_id === id);
        setSubCategories(relatedSubCats);

        // Fetch all services and filter by parent_category_id
        // We can pass ?parent_category_id=id but public/services might not support it yet.
        // Let's just fetch all and filter in frontend for now to be safe.
        const srvRes = await API.get('/public/services');
        const relatedServices = srvRes.data.filter((s: any) => s.parent_category_id === id);
        setServices(relatedServices);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubCategoryClick = (subCat: SubCategory) => {
    navigate(`/subcategory/${subCat.id}/services`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#00674F] text-white py-12 px-4 relative">
        <div className="max-w-7xl mx-auto relative flex flex-col items-center justify-center">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/80 hover:text-white transition-all group cursor-pointer"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-center">Services</h1>
          <p className="text-white/80 text-center">Choose from our wide range of services</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : subCategories.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No categories found for this selection.</div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {subCategories.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => handleSubCategoryClick(cat)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Simulated Icon for Sub Category */}
                <div className="w-20 h-20 bg-[#E6F0ED] rounded-2xl flex items-center justify-center mb-3 shadow-sm transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                  <span className="text-[#00674F] text-3xl font-bold">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 text-center max-w-[100px] leading-tight group-hover:text-[#00674F]">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryServices;
