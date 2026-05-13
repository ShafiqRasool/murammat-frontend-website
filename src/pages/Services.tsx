import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';
import CategoryHero from '../Components/Services/CategoryHero';
import ServicesCards from '../Components/Services/ServicesCards';
import SubcategoryDescription from '../Components/Services/SubcategoryDescription';

const ServicesPage = () => {
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  const [subcategory, setSubcategory] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
      
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all categories to find the specific subcategory
        const catRes = await API.get('/public/categories');
        const foundCat = catRes.data.find((c: any) => c.id === subcategoryId);
        setSubcategory(foundCat || { name: 'Services', long_description: '' });

        // Fetch services for this subcategory
        const srvRes = await API.get(`/public/services?category_id=${subcategoryId}`);
        setServices(srvRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (subcategoryId) fetchData();
  }, [subcategoryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40 min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#00674F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CategoryHero categoryName={subcategory?.name || 'Services'} />
      
      <div className="flex-grow">
        <ServicesCards services={services} />
      </div>
      
      {subcategory?.long_description && (
        <SubcategoryDescription 
          title={`${subcategory.name} Services in Pakistan`} 
          description={subcategory.long_description} 
        />
      )}
    </div>
  );
};

export default ServicesPage;