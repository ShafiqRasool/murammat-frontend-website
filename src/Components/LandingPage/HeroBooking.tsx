import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, CheckCircle, Map, ShieldCheck, Star, Banknote, ChevronDown } from 'lucide-react';
import API from '../../utils/api';

interface FormData {
  name: string;
  phone: string;
  service: string;
  area: string;
  address: string;
}

const HeroBooking: React.FC = () => {
  const navigate = useNavigate();
  const [adminServices, setAdminServices] = useState<Array<{ id: string; name: string }>>([]);
  const [lahoreAreas, setLahoreAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, areasRes] = await Promise.all([
          API.get('/public/services'),
          API.get('/public/areas')
        ]);
        if (servicesRes.data) {
          setAdminServices(servicesRes.data.map((s: any) => ({ id: s.id, name: s.name })));
        }
        if (areasRes.data) {
          setLahoreAreas(areasRes.data.map((a: any) => a.name));
        }
      } catch (error) {
        console.error('Failed to fetch services or areas:', error);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    service: '',
    area: '',
    address: ''
  });

  const [phoneError, setPhoneError] = useState<string>('');
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);

  // dynamically filters the list based on user typing
  const filteredServices = adminServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setPhoneError('');
      if (value !== '' && !/^\d+$/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequestCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 11) {
      setPhoneError('Enter exactly 11 digits (e.g., 03218180319)');
      return;
    }
    
    try {
      await API.post('/public/call-requests', formData);
      setShowLocationPopup(true);
    } catch (error) {
      console.error('Error submitting call request:', error);
      // Fallback in case of error
      setShowLocationPopup(true);
    }
  };

  const handleAllowLocation = () => {
    setShowLocationPopup(false);
    setShowSuccess(true);
  };

  const handleDenyLocation = () => {
    setShowLocationPopup(false);
    setShowSuccess(true);
  };

  const handleTagClick = (serviceName: string) => {
    const foundService = adminServices.find(s => s.name.toLowerCase() === serviceName.toLowerCase());
    if (foundService) {
      navigate(`/services/${foundService.id}`);
    } else {
      setSearchQuery(serviceName);
      setFormData(prev => ({ ...prev, service: serviceName }));
      setShowSearchDropdown(false);
    }
  };

  const handleSuggestionClick = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const popularTags = ['AC Repair', 'Electrical Services', 'Plumbing Services', 'Cleaning Services'];

  if (showSuccess) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#01261C] to-[#004D3B] text-white p-6 animate-fade-in antialiased relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#009b77]/10 rounded-full blur-3xl pointer-events-none"></div>
        <CheckCircle size={70} className="text-[#00ffc4] mb-5 animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center mb-3">
          Thank you for choosing Murammat!
        </h2>
        <p className="text-base text-emerald-100 text-center max-w-md leading-relaxed">
          Your request for <span className="font-semibold text-white">{formData.service || 'our services'}</span> has been received. Our team will call you at <span className="font-semibold text-white">{formData.phone}</span> shortly.
        </p>
        <button 
          onClick={() => { setShowSuccess(false); setFormData({name:'', phone:'', service:'', area:'', address:''}); setSearchQuery(''); }}
          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-[#00674F] to-[#009b77] text-white font-bold rounded-lg hover:from-[#00523f] hover:to-[#00aa82] transition-all shadow-md active:scale-95"
        >
          Book Another Service
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] text-white py-20 px-4 sm:px-6 lg:px-8 relative antialiased overflow-hidden group">
      <style>{`
        @keyframes float-blob-1 {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1); }
          33% { transform: translate3d(30px, -40px, 0) scale(1.08); }
          66% { transform: translate3d(-20px, 20px, 0) scale(0.96); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate3d(0px, 0px, 0) scale(1.05); }
          50% { transform: translate3d(-30px, 30px, 0) scale(0.92); }
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-blob-1 {
          animation: float-blob-1 12s ease-in-out infinite;
          will-change: transform;
        }
        .animate-float-blob-2 {
          animation: float-blob-2 15s ease-in-out infinite;
          will-change: transform;
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 6s linear infinite;
        }
        @keyframes scroll-down-dot {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          65% { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }
        .animate-scroll-down-dot {
          animation: scroll-down-dot 1.8s cubic-bezier(0.15, 0.41, 0.69, 0.94) infinite;
        }
      `}</style>

      {/* Drifting gradient blur background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#009b77]/15 rounded-full blur-3xl pointer-events-none z-0 animate-float-blob-1"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-float-blob-2"></div>
      <div className="absolute top-[25%] right-[25%] w-[320px] h-[320px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-float-blob-1"></div>

      {/* Abstract Glowing Fluid Wave Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.14]">
        <svg className="w-full h-full min-h-[600px]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100 350 C 300 150, 700 550, 1100 250 C 1300 100, 1500 180, 1600 200" stroke="url(#wave-gradient)" strokeWidth="3" strokeLinecap="round" />
          <path d="M-50 420 C 350 250, 650 620, 1050 320 C 1250 180, 1450 250, 1550 270" stroke="url(#wave-gradient)" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00ffc4" />
              <stop offset="0.5" stopColor="#00674F" />
              <stop offset="1" stopColor="rgba(234, 179, 8, 0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 relative z-10">
        
        {/* LEFT COLUMN: Headings, Search & Badges */}
        <div className="w-full lg:w-[50%] xl:w-[55%] space-y-7">
          <div className="inline-flex items-center gap-2 bg-[#00674F]/30 text-[#00ffc4] border border-[#009b77]/30 font-bold text-[11px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffc4] animate-pulse"></span>
            Verified Professional Services
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
            Your Home, Perfected. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc4] via-[#009b77] to-yellow-300 animate-text-shimmer">
              Expert Care on Demand.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-lg">
            Murammat.pk delivers 360° value-added home maintenance. We hire, train, and deploy certified in-house experts directly to your home with post-service guarantees.
          </p>
          
          {/* SEARCH BAR SECTION */}
          <div className="space-y-4 w-full max-w-md pt-2">
            <div className="relative">
              <div className="flex items-center bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transition-all duration-300 transform hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:ring-2 focus-within:ring-[#00ffc4]/50 relative z-20 shadow-lg">
                <div className="flex items-center px-4 py-3.5 bg-white/5 border-r border-white/10 min-w-[110px]">
                  <MapPin size={16} className="text-[#00ffc4] mr-2" />
                  <span className="text-slate-200 font-semibold text-sm">Lahore</span>
                </div>
                
                <input 
                  type="text" 
                  placeholder="What service do you need help with?" 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 250)}
                  className="flex-1 px-4 py-3.5 text-sm focus:outline-none text-white bg-transparent placeholder-slate-400"
                />
                
                <button className="px-5 py-3.5 bg-white/5 hover:bg-[#00ffc4]/15 transition-colors border-l border-white/10 group">
                  <Search size={18} className="text-[#00ffc4] group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>

              {/* SEARCH DROPDOWN MENU */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 w-full mt-2 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-60 overflow-y-auto">
                  {filteredServices.length > 0 ? (
                    <ul className="py-1">
                      {filteredServices.map((service, idx) => (
                        <li 
                          key={idx}
                          onMouseDown={() => handleSuggestionClick(service.id)}
                          className="px-5 py-3 hover:bg-[#009b77]/20 cursor-pointer text-sm text-emerald-100 border-b border-white/5 last:border-none transition-colors"
                        >
                          {searchQuery ? (
                            service.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.toLowerCase() 
                                ? <span key={i} className="font-bold text-[#00ffc4]">{part}</span> 
                                : part
                            )
                          ) : (
                            service.name
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-4 text-sm text-emerald-200/60 text-center">
                      No services found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* POPULAR SEARCH TAGS */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-emerald-200/50 font-medium">Popular:</span>
              {popularTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTagClick(tag)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-[#00ffc4] hover:text-[#012218] hover:border-transparent transition-all cursor-pointer font-medium text-emerald-100"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE TRUST BADGES/CARDS */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 w-full max-w-lg">
            <div className="flex flex-col gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00ffc4]/30 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:-translate-y-0.5 transition-all duration-300 group/card">
              <div className="p-1.5 bg-[#00ffc4]/10 rounded-lg text-[#00ffc4] w-fit group-hover/card:scale-105 group-hover/card:bg-[#00ffc4]/20 transition-all">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">100% Vetted Techs</span>
              <p className="text-[10px] text-emerald-100/60 leading-snug">Fully trained in-house team</p>
            </div>
            <div className="flex flex-col gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-yellow-400/30 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(234,179,8,0.05)] hover:-translate-y-0.5 transition-all duration-300 group/card">
              <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-400 w-fit group-hover/card:scale-105 group-hover/card:bg-yellow-500/20 transition-all">
                <Star size={18} />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Top-Tier Rated</span>
              <p className="text-[10px] text-emerald-100/60 leading-snug">10k+ satisfied customers</p>
            </div>
            <div className="flex flex-col gap-2.5 p-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-[#00ffc4]/30 hover:bg-white/10 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:-translate-y-0.5 transition-all duration-300 group/card">
              <div className="p-1.5 bg-[#00ffc4]/10 rounded-lg text-[#00ffc4] w-fit group-hover/card:scale-105 group-hover/card:bg-[#00ffc4]/20 transition-all">
                <Banknote size={18} />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">Clear Pricing</span>
              <p className="text-[10px] text-emerald-100/60 leading-snug">No hidden surprises</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING FORM CARD (GLASSMORPHISM) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex lg:justify-end">
          <div className="bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8 w-full max-w-[400px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00ffc4] via-[#009b77] to-yellow-300"></div>
            
            <h2 className="text-2xl font-extrabold text-white mb-1.5 tracking-tight">Book Your Service</h2>
            <p className="text-xs text-emerald-100/60 mb-6 leading-relaxed">Fill details below for an immediate callback</p>
            
            <form onSubmit={handleRequestCall} className="space-y-4">
              <div className="relative">
                <input 
                  required 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Your Name"
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all shadow-inner" 
                />
              </div>
              
              <div>
                <input 
                  required 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="Phone (03XXXXXXXXX)" 
                  maxLength={11}
                  className={`w-full px-4 py-3.5 text-sm rounded-lg border bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 transition-all shadow-inner ${phoneError ? 'focus:ring-red-500 border-red-500/80 text-red-100' : 'border-white/10 focus:ring-[#00ffc4] focus:border-transparent'}`} 
                />
                {phoneError && <p className="text-red-400 text-[11px] mt-1 font-semibold">{phoneError}</p>}
              </div>

              <div className="relative">
                <select 
                  required 
                  name="service" 
                  value={formData.service} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-slate-900 text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Select Service</option>
                  {adminServices.map((service, idx) => (
                    <option key={idx} value={service.name} className="bg-slate-900 text-slate-200">{service.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <div className="relative">
                <select 
                  required 
                  name="area" 
                  value={formData.area} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-slate-900 text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all appearance-none cursor-pointer shadow-inner"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Select Lahore Area</option>
                  {lahoreAreas.map((area, idx) => (
                    <option key={idx} value={area} className="bg-slate-900 text-slate-200">{area}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <div className="relative">
                <input 
                  required 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="House / Street Address"
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all shadow-inner" 
                />
              </div>

              <button 
                type="submit"
                className="relative overflow-hidden w-full mt-2 py-3.5 bg-gradient-to-r from-[#00674F] to-[#009b77] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#009b77]/20 hover:shadow-xl hover:shadow-[#009b77]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer text-center"
              >
                Request a Call
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Downward indicator pointing to top-services */}
      <div 
        onClick={() => {
          document.getElementById('top-services')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer z-20 group/scroll"
      >
        {/* Text Badge with glassmorphism styling */}
        <div className="mb-3.5 px-4 py-1.5 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5 group-hover/scroll:border-[#00ffc4]/30 group-hover/scroll:bg-slate-950/70 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-[#00ffc4] group-hover/scroll:text-white transition-colors duration-300">
            Browse Our Services
          </span>
        </div>

        {/* Vertical Mouse Scroll Wheel Simulation */}
        <div className="w-[28px] h-[48px] rounded-full border-2 border-[#00ffc4]/30 bg-slate-950/20 backdrop-blur-[2px] flex justify-center p-1.5 shadow-[0_0_15px_rgba(0,255,196,0.05)] group-hover/scroll:border-[#00ffc4]/80 group-hover/scroll:shadow-[0_0_20px_rgba(0,255,196,0.25)] transition-all duration-300">
          <div className="w-1.5 h-3 bg-gradient-to-b from-[#00ffc4] to-[#009b77] rounded-full animate-scroll-down-dot" />
        </div>

        {/* Small bouncing arrows pointing downward */}
        <ChevronDown className="text-[#00ffc4]/40 group-hover/scroll:text-[#00ffc4] mt-2 w-4 h-4 animate-bounce duration-1000" />
      </div>

      {/* --- LOCATION PERMISSION POPUP --- */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in antialiased">
          <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-7 max-w-[340px] w-full text-center transform transition-all animate-slide-up">
            <div className="w-14 h-14 bg-[#00ffc4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="text-[#00ffc4]" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1.5 tracking-tight">Allow Location Access?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              To provide the fastest service and track our experts, Murammat needs your exact location.
            </p>
            <div className="flex flex-col space-y-2.5">
              <button 
                onClick={handleAllowLocation} 
                className="w-full py-2.5 bg-gradient-to-r from-[#00674F] to-[#009b77] text-white text-sm font-bold rounded-lg hover:from-[#00523f] hover:to-[#00aa82] transition-colors shadow-sm cursor-pointer"
              >
                Allow Access
              </button>
              <button 
                onClick={handleDenyLocation} 
                className="w-full py-2.5 bg-transparent text-slate-400 text-sm font-bold rounded-lg hover:bg-slate-800 hover:text-white transition-colors border border-white/10 cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBooking;