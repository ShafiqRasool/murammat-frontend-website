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
  const [parentCategoryName, setParentCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch sub-categories
        const catRes = await API.get('/public/categories');
        const relatedSubCats = catRes.data.filter((c: SubCategory) => c.parent_category_id === id);
        setSubCategories(relatedSubCats);

        // Fetch parent categories to get current parent category name
        const parentRes = await API.get('/public/parent-categories');
        const parentCat = parentRes.data.find((pc: any) => pc.id === id);
        if (parentCat) {
          setParentCategoryName(parentCat.name);
        }

        // Fetch all services and filter by parent_category_id
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
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-[#E6F0ED] rounded-full flex items-center justify-center text-[#00674F] animate-pulse">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="36" height="36">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">More {parentCategoryName || 'Services'} Coming Soon!</h2>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              We are currently expanding our catalogue. More {parentCategoryName || 'services'} are under way!
            </p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-4 px-8 py-3 bg-gradient-to-r from-[#00674F] to-[#00a87a] text-white font-bold rounded-xl shadow-lg shadow-[#00674F]/20 hover:shadow-xl hover:shadow-[#00a87a]/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              Request a Callback
            </button>
          </div>
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
            
            {/* Custom Coming Soon Card alongside Subcategories */}
            <div 
              onClick={() => navigate('/')}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-dashed border-slate-300 transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} width="28" height="28" className="text-slate-400">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3 className="text-xs font-semibold text-slate-400 text-center max-w-[120px] leading-tight group-hover:text-[#00674F]">
                More {parentCategoryName || 'Services'} Coming Soon
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryServices;
