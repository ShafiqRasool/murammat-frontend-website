import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/api';

// Define the data structure for the dynamic service cards
export interface RecommendedService {
  id: string;
  name: string;
  image_url?: string;
  small_description?: string;
}

interface RecommendedServicesProps {
  title?: string;
  subtitle?: string;
}

const RecommendedServices: React.FC<RecommendedServicesProps> = ({ 
  title = "Recommended Services",
  subtitle = "Services highly recommended by our valuable customers."
}) => {
  const navigate = useNavigate();
  const [services, setServices] = useState<RecommendedService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await API.get('/public/services');
        // Get up to 8 services for the homepage
        setServices(response.data.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getImageUrl = (url?: string) => {
    if (!url) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (url.startsWith('http')) return url;
    // Base URL might be http://localhost:3000/api, we need just the domain
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  };
  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            {title}
          </h2>
          <p className="text-base text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Dynamic Image Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-center">
          
          {loading ? (
            // Skeleton loaders
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-2xl h-[250px] sm:h-[280px] md:h-[300px]"></div>
            ))
          ) : services.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-10">
              No services found.
            </div>
          ) : (
            services.map((service) => (
              <div 
                key={service.id} 
                onClick={() => navigate(`/services/${service.id}`)}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-[250px] sm:h-[280px] md:h-[300px] flex flex-col bg-gray-200"
              >
              {/* Background Image with smooth zoom effect on hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-[1.15]"
                style={{ backgroundImage: `url(${getImageUrl(service.image_url)})` }}
              ></div>

              {/* Rich Dark Gradient Overlay to boost text legibility and aesthetics */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Card Content Container */}
              <div className="relative h-full flex flex-col justify-end p-5 z-10 overflow-hidden">
                
                {/* Title */}
                <h3 className="text-white text-lg sm:text-xl font-bold leading-tight drop-shadow-md mb-4 transform transition-transform duration-500 group-hover:-translate-y-1">
                  {service.name}
                </h3>

                {/* Animated "Book Now" Button */}
                <button className="w-full bg-[#00674F] hover:bg-[#005440] text-white py-3 rounded-xl font-semibold text-sm transition-all duration-500 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 shadow-[0_4px_14px_0_rgba(0,103,79,0.39)] hover:shadow-[0_6px_20px_rgba(0,103,79,0.23)]">
                  Book Now
                </button>
                
              </div>
            </div>
          )))}
          
        </div>

      </div>
    </section>
  );
};

export default RecommendedServices;