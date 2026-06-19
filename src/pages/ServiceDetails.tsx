import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import API from '../utils/api';

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

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 flex items-center justify-center">
        <div className="p-20 text-center animate-pulse text-[#00674F] font-bold text-lg">
          Loading Service Details...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 text-gray-800 flex flex-col antialiased relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes float-detail-blob {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1); }
          50% { transform: translate3d(-30px, 20px, 0) scale(1.08); }
        }
        @keyframes float-detail-blob-2 {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1.05); }
          50% { transform: translate3d(20px, -30px, 0) scale(0.92); }
        }
        .animate-detail-blob {
          animation: float-detail-blob 12s ease-in-out infinite;
          will-change: transform;
        }
        .animate-detail-blob-2 {
          animation: float-detail-blob-2 15s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Drifting gradient blur background elements (Light Theme) */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-detail-blob"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-detail-blob-2"></div>
      <div className="absolute top-[45%] right-[20%] w-[300px] h-[300px] bg-[#00ffc4]/5 rounded-full blur-3xl pointer-events-none z-0 animate-detail-blob"></div>

      {/* Abstract Glowing Fluid Wave Line (Subtle opacity for light theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.05]">
        <svg className="w-full h-full min-h-[800px]" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100 400 C 300 200, 700 600, 1100 300 C 1300 150, 1500 230, 1600 250" stroke="url(#details-wave-gradient)" strokeWidth="3" strokeLinecap="round" />
          <path d="M-50 470 C 350 300, 650 670, 1050 370 C 1250 230, 1450 300, 1550 320" stroke="url(#details-wave-gradient)" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="details-wave-gradient" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00ffc4" />
              <stop offset="0.5" stopColor="#00674F" />
              <stop offset="1" stopColor="rgba(234, 179, 8, 0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* Back Navigation Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-[#00674F] font-bold text-xs shadow-sm transition-all duration-300 group hover:-translate-y-0.5"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO SERVICES</span>
        </button>

        {service ? (
          /* Main Crisp White Glassmorphic Card */
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-150 p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
            {/* Colorful top brand gradient line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00ffc4] via-[#00674F] to-yellow-400"></div>

            {/* Left Column: Visual Cover & Verification */}
            <div className="w-full md:w-1/2 flex flex-col gap-4">
              <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-md relative group/img aspect-[4/3] md:aspect-square">
                <img 
                  src={getImageUrl(service.image_url)} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Murammat Verified Care Guarantee Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-100 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg text-[#00674F]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Murammat Verified</p>
                    <p className="text-[9px] text-gray-500 leading-tight">100% Quality & Professional Care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Pricing & Inclusions */}
            <div className="w-full md:w-1/2 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <span className="w-fit inline-flex items-center gap-1.5 bg-emerald-50 text-[#00674F] border border-emerald-100 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  <Sparkles size={11} className="text-[#00674F] animate-pulse" />
                  Premium Service
                </span>

                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight capitalize">
                  {service.name}
                </h1>

                {/* Pricing Box Section */}
                <div className="p-4 rounded-xl bg-slate-50 border border-gray-150 flex items-center justify-between w-fit gap-6 shadow-inner">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Service Price</p>
                    {service.discounted_price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#00674F]">PKR {Number(service.discounted_price).toLocaleString()}</span>
                        <span className="text-xs text-gray-400 line-through">PKR {Number(service.base_price).toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-gray-900">PKR {Number(service.base_price).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="px-3 py-1.5 bg-emerald-50 text-[#00674F] border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    Best Rate
                  </div>
                </div>

                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {service.description || service.small_description || "Get the best professional services tailored to your needs. Highly rated and reliable."}
                </p>

                {/* Included / Not Included Lists Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Included Card */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl space-y-2.5">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-emerald-100 pb-1.5">
                      <Check size={14} className="text-[#00674F] stroke-[2.5]" />
                      Included
                    </h3>
                    {service.includes?.length > 0 ? (
                      <ul className="space-y-1">
                        {service.includes.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700 leading-snug">
                            <span className="text-[#00674F] font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-emerald-600/70 italic">Verified by support team</p>
                    )}
                  </div>

                  {/* Not Included Card */}
                  <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl space-y-2.5">
                    <h3 className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider border-b border-red-100 pb-1.5">
                      <X size={14} className="text-red-500 stroke-[2.5]" />
                      Not Included
                    </h3>
                    {service.not_includes?.length > 0 ? (
                      <ul className="space-y-1">
                        {service.not_includes.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-red-700 leading-snug">
                            <span className="text-red-500 font-bold mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-red-600/70 italic">Materials billed separately</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: Place Order */}
              <button 
                onClick={() => navigate(`/checkout/${service.id}`)}
                className="w-full py-4 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#00523f] hover:to-[#00aa82] text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                <span>BOOK & PLACE ORDER</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-150 p-12 text-center text-xl font-bold text-red-500">
            Service Not Found
          </div>
        )}
      </div>
    </div>
  );
}
