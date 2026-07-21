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
                {/* Sale tag removed */}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 break-words">{service.name}</h3>
                </div>

                <div className="flex items-center gap-1 mb-4 text-[#00674F]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{rating}</span>
                  {/* <span className="text-gray-400 text-sm ml-1">(120+ reviews)</span> */}
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2 flex-grow">
                  {service.small_description || service.description || "Professional service tailored to your needs."}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Starting from</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#00674F] whitespace-nowrap">
                        PKR {Number(service.discounted_price || service.base_price).toLocaleString()}
                      </span>
                      {service.discounted_price && (
                        <span className="text-sm text-gray-400 line-through whitespace-nowrap">
                          {Number(service.base_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/services/${service.id}`)}
                    className="bg-[#00674F] hover:bg-[#00523e] text-white px-6 py-2.5 rounded-xl font-semibold transition-colors duration-200 w-full sm:w-auto text-center"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Coming Soon Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-lg border border-white/5 p-6 flex flex-col justify-between text-center relative overflow-hidden group min-h-[350px]">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00674F] to-[#00a87a]"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00674F]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#00a87a]/20 transition-all duration-500"></div>

          <div className="my-auto space-y-4">
            <div className="w-16 h-16 bg-[#00674F]/20 rounded-full flex items-center justify-center mx-auto text-[#00ffc4] group-hover:scale-110 transition-transform duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width="28" height="28">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">More Services Coming Soon!</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              We are constantly adding new professional services to our catalog. Need something custom? Let us know!
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-6 w-full py-3 bg-gradient-to-r from-[#00674F] to-[#00a87a] text-white font-bold rounded-xl shadow-lg shadow-[#00674F]/20 hover:shadow-xl hover:shadow-[#00a87a]/30 transition-all active:scale-[0.98] cursor-pointer"
          >
            Request a Callback
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServicesCards;