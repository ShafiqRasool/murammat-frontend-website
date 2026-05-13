import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { Button } from '../Components/UI/Button';
import { Card } from '../Components/UI/Card';

export default function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/public/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Failed to fetch service", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchService();
  }, [id]);

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  };

  if (loading) return <div className="p-20 text-center animate-fade-in text-[#878787]">Loading Service...</div>;

  return (
    <div className="container mx-auto p-8 animate-slide-up">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        &larr; Back
      </Button>

      {service ? (
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[400px]">
              <img 
                src={getImageUrl(service.image_url)} 
                alt={service.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <h1 className="text-4xl font-bold text-[#00674F] capitalize">{service.name}</h1>
              
              <div className="text-2xl font-semibold text-gray-800">
                {service.discounted_price ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-600">PKR {Number(service.discounted_price).toLocaleString()}</span>
                    <span className="text-gray-400 line-through text-lg">PKR {Number(service.base_price).toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-gray-800">PKR {Number(service.base_price).toLocaleString()}</span>
                )}
              </div>

              <p className="text-[#878787] text-lg leading-relaxed">
                {service.description || service.small_description || "Get the best professional services tailored to your needs. Highly rated and reliable."}
              </p>

              {(service.includes?.length > 0 || service.not_includes?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {service.includes?.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-bold text-green-800 mb-2">Included:</h3>
                      <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
                        {service.includes.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {service.not_includes?.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold text-red-800 mb-2">Not Included:</h3>
                      <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                        {service.not_includes.map((item: string, i: number) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <Button 
                  className="w-full text-lg py-4 hover:scale-[1.02] transition-transform shadow-lg" 
                  onClick={() => navigate(`/checkout/${service.id}`)}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center text-2xl text-red-500">Service Not Found</div>
      )}
    </div>
  );
}
