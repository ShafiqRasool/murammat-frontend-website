import React, { useState, useEffect } from 'react';
import { Search, MapPin, CheckCircle, Map } from 'lucide-react';
import API from '../../utils/api';

interface FormData {
  name: string;
  phone: string;
  service: string;
  area: string;
  address: string;
}

const HeroBooking: React.FC = () => {
  const [adminServices, setAdminServices] = useState<string[]>([]);
  const [lahoreAreas, setLahoreAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, areasRes] = await Promise.all([
          API.get('/public/services'),
          API.get('/public/areas')
        ]);
        if (servicesRes.data) {
          setAdminServices(servicesRes.data.map((s: any) => s.name));
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
    service.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (showSuccess) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-gray-50/50 p-6 animate-fade-in antialiased">
        <CheckCircle size={70} className="text-[#00674F] mb-5 animate-bounce" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight text-center mb-3">
          Thank you for choosing Murammat!
        </h2>
        <p className="text-base text-gray-600 text-center max-w-md leading-relaxed">
          Your request for <span className="font-semibold text-gray-800">{formData.service || 'our services'}</span> has been received. Our team will call you at <span className="font-semibold text-gray-800">{formData.phone}</span> shortly.
        </p>
        <button 
          onClick={() => { setShowSuccess(false); setFormData({name:'', phone:'', service:'', area:'', address:''}); setSearchQuery(''); }}
          className="mt-6 px-6 py-2.5 bg-[#00674F] text-white font-medium rounded-lg hover:bg-[#00523f] transition-colors shadow-sm"
        >
          Book Another Service
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 relative antialiased">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-inherit">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00674F]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-6">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[50%] xl:w-[55%] space-y-5 z-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Skilled Professionals <br className="hidden sm:block" />
            <span className="text-[#00674F]">At Your Doorstep.</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-lg">
            Murammat.pk is Lahore's premier home service provider. From emergency AC repairs to deep cleaning, we ensure your peace of mind by deploying verified, uniformed experts directly to your home.
          </p>
          
          {/* SEARCH BAR SECTION */}
          <div className="relative hidden sm:block w-full max-w-md mt-8">
            <div className="flex items-center bg-white rounded-xl shadow-[0_8px_25px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,103,79,0.12)] border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 focus-within:-translate-y-1 focus-within:ring-2 focus-within:ring-[#00674F]/30 relative z-20">
              <div className="flex items-center px-4 py-3 bg-[#878787]/5 border-r border-gray-100 min-w-[110px]">
                <MapPin size={16} className="text-[#00674F] mr-2" />
                <span className="text-gray-700 font-medium text-sm">Lahore</span>
              </div>
              
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="flex-1 px-4 py-3 text-sm focus:outline-none text-gray-700 bg-transparent placeholder-gray-400"
              />
              
              <button className="px-5 py-3 bg-[#00674F]/5 hover:bg-[#00674F]/10 transition-colors border-l border-gray-100 group">
                <Search size={18} className="text-[#00674F] group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>

            {/* SEARCH DROPDOWN MENU - Now shows immediately on focus */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                {filteredServices.length > 0 ? (
                  <ul className="max-h-60 overflow-y-auto py-1">
                    {filteredServices.map((service, idx) => (
                      <li 
                        key={idx}
                        onMouseDown={() => {
                          setSearchQuery(service); // Fills search input
                          setFormData(prev => ({ ...prev, service: service })); // Auto-selects form dropdown!
                          setShowSearchDropdown(false);
                        }}
                        className="px-5 py-3 hover:bg-[#00674F]/5 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none transition-colors"
                      >
                        {/* Highlights matching text if user typed something */}
                        <span>
                          {searchQuery ? (
                            service.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchQuery.toLowerCase() 
                                ? <span key={i} className="font-bold text-[#00674F]">{part}</span> 
                                : part
                            )
                          ) : (
                            service
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-500 text-center">
                    No services found matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING FORM */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex lg:justify-end z-10">
          <div className="bg-[#878787]/15 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_rgba(0,103,79,0.08)] border border-[#878787]/20 p-6 md:p-7 w-full max-w-[380px] relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00674F] to-[#009b77]"></div>
            
            <h2 className="text-xl font-extrabold text-gray-900 mb-5 tracking-tight">Book your service</h2>
            
            <form onSubmit={handleRequestCall} className="space-y-3.5">
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-transparent text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] transition-all hover:border-[#878787]/50 shadow-sm placeholder-gray-400" />
              
              <div>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone (03XXXXXXXXX)" maxLength={11}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all shadow-sm placeholder-gray-400 ${phoneError ? 'focus:ring-red-500/40 border-red-400 text-red-900' : 'border-transparent hover:border-[#878787]/50 focus:ring-[#00674F]/40 focus:border-[#00674F] text-gray-900'}`} />
                {phoneError && <p className="text-red-500 text-[11px] mt-1 font-medium">{phoneError}</p>}
              </div>

              <select required name="service" value={formData.service} onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-transparent text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] transition-all hover:border-[#878787]/50 shadow-sm appearance-none cursor-pointer placeholder-gray-400">
                <option value="" disabled>Select Service</option>
                {adminServices.map((service, idx) => (
                  <option key={idx} value={service}>{service}</option>
                ))}
              </select>

              <select required name="area" value={formData.area} onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-transparent text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] transition-all hover:border-[#878787]/50 shadow-sm appearance-none cursor-pointer placeholder-gray-400">
                <option value="" disabled>Select Lahore Area</option>
                {lahoreAreas.map((area, idx) => (
                  <option key={idx} value={area}>{area}</option>
                ))}
              </select>

              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="House / Street Address"
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-transparent text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/40 focus:border-[#00674F] transition-all hover:border-[#878787]/50 shadow-sm placeholder-gray-400" />

              <button type="submit"
                className="group relative overflow-hidden w-full mt-3 py-3 bg-[#00674F] text-white text-sm font-bold rounded-lg shadow-[0_4px_14px_0_rgba(0,103,79,0.39)] hover:shadow-[0_6px_20px_rgba(0,103,79,0.23)] transition-all duration-300 transform hover:-translate-y-0.5 z-0">
                <span className="absolute top-0 -left-[100%] w-1/2 h-full block bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] transition-all duration-700 ease-in-out group-hover:left-[150%] z-10"></span>
                <span className="relative z-20">Request a Call</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- LOCATION PERMISSION POPUP --- */}
      {showLocationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in antialiased">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-[340px] w-full text-center transform transition-all animate-slide-up border border-gray-100">
            <div className="w-14 h-14 bg-[#00674F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Map className="text-[#00674F]" size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 tracking-tight">Allow Location Access?</h3>
            <p className="text-[#878787] text-sm mb-6 leading-relaxed">
              To provide the fastest service and track our experts, Murammat needs your exact location.
            </p>
            <div className="flex flex-col space-y-2.5">
              <button onClick={handleAllowLocation} className="w-full py-2.5 bg-[#00674F] text-white text-sm font-bold rounded-lg hover:bg-[#00523f] transition-colors shadow-sm">
                Allow Access
              </button>
              <button onClick={handleDenyLocation} className="w-full py-2.5 bg-white text-[#878787] text-sm font-bold rounded-lg hover:bg-[#878787]/10 hover:text-gray-900 transition-colors border border-[#878787]/30">
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