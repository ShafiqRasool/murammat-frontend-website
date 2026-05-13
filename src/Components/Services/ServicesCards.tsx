import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  small_description?: string;
  base_price: number | string;
  discounted_price?: number | string;
  image_url?: string;
}

interface ServicesCardsProps {
  services: Service[];
}

const generateRandomRating = (min = 4.4, max = 5.0) => {
  return (Math.random() * (max - min) + min).toFixed(1);
};

const getImageUrl = (url?: string) => {
  if (!url) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${url}`;
};

const ServicesCards: React.FC<ServicesCardsProps> = ({ services }) => {
  const navigate = useNavigate();

  if (!services || services.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-500">
        No services available for this category right now.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => {
          const rating = generateRandomRating();
          return (
            <div 
              key={service.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={getImageUrl(service.image_url)} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                {service.discounted_price && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    Sale
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{service.name}</h3>
                </div>
                
                <div className="flex items-center gap-1 mb-4 text-[#00674F]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{rating}</span>
                  <span className="text-gray-400 text-sm ml-1">(120+ reviews)</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
                  {service.small_description || service.description || "Professional service tailored to your needs."}
                </p>
                
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Starting from</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#00674F]">
                        PKR {Number(service.discounted_price || service.base_price).toLocaleString()}
                      </span>
                      {service.discounted_price && (
                        <span className="text-sm text-gray-400 line-through">
                          {Number(service.base_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="bg-[#00674F] hover:bg-[#00523e] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors duration-200"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesCards;