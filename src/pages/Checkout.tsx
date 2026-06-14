import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { loginSuccess } from '../store/authSlice';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { Edit2, Minus, Plus, ImagePlus, X, MapPin } from 'lucide-react';

export default function Checkout() {
  const { service_id } = useParams<{ service_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  const mediaBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [service, setService] = useState<any>(null);

  // Dates & Times
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [times, setTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Form states
  const [phone, setPhone] = useState(user?.phone || '');
  const [isEditingPhone, setIsEditingPhone] = useState(!user?.phone);
  
  const [quantity, setQuantity] = useState(1);
  const [problemMessage, setProblemMessage] = useState('');
  const [problemImage, setProblemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Address Modal States
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [addressLine, setAddressLine] = useState('');

  // Completed Address to display
  const [savedAddress, setSavedAddress] = useState<{cityId: string, areaId: string, line: string, displayArea: string} | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Fetch Service
        const sRes = await API.get('/public/services');
        const found = sRes.data.find((s: any) => s.id === service_id);
        if (found) {
          setService(found);
        } else {
          setService({ id: service_id, name: 'Custom Service', base_price: 1500 });
        }

        // Fetch Cities
        const cRes = await API.get('/public/cities');
        setCities(cRes.data);
        const lahore = cRes.data.find((c: any) => c.name.toLowerCase() === 'lahore');
        if (lahore) {
          setSelectedCityId(lahore.id);
        } else if (cRes.data.length > 0) {
          setSelectedCityId(cRes.data[0].id);
        }

        // Generate Dates (Today to +30 days)
        const dateArray = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          dateArray.push(d);
        }
        setDates(dateArray);
        setSelectedDate(dateArray[0]);

        // Generate Times (9 AM to 10 PM)
        const timeArray = [];
        for (let h = 9; h <= 22; h++) {
          const period = h >= 12 ? 'PM' : 'AM';
          const hour = h > 12 ? h - 12 : (h === 0 ? 12 : h);
          const hrStr = hour < 10 ? `0${hour}` : hour.toString();
          timeArray.push(`${hrStr}:00 ${period}`);
          if (h !== 22) timeArray.push(`${hrStr}:30 ${period}`);
        }
        setTimes(timeArray);
        setSelectedTime(timeArray[0]);

      } catch (error) {
        console.error('Failed to init checkout', error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [token, navigate, service_id]);

  useEffect(() => {
    if (!selectedCityId) return;
    const fetchAreas = async () => {
      try {
        const aRes = await API.get(`/public/areas?city_id=${selectedCityId}`);
        setAreas(aRes.data);
      } catch (error) {
        console.error('Failed to load areas', error);
      }
    };
    fetchAreas();
  }, [selectedCityId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProblemImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProblemImage(null);
    setImagePreview(null);
  };

  const handleSaveAddress = () => {
    if (!selectedAreaId || !addressLine) {
      toast.error('Area and Address Details are required!');
      return;
    }
    const areaObj = areas.find(a => a.id === selectedAreaId);
    setSavedAddress({
      cityId: selectedCityId,
      areaId: selectedAreaId,
      line: addressLine,
      displayArea: areaObj ? areaObj.name : ''
    });
    setShowAddressModal(false);
    toast.success('Address submitted', { style: { background: '#00674F', color: '#fff' } });
  };

  const handlePlaceOrder = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time.');
      return;
    }
    if (!phone || phone.length < 11) {
      toast.error('A valid 11-digit phone number is required.');
      return;
    }
    if (!savedAddress) {
      toast.error('Please provide a service address.');
      return;
    }

    setSubmitting(true);
    try {
      if (!token) {
        // Guest Checkout: Sign up/login by phone
        const guestRes = await API.post('/auth/guest-checkout', { phone });
        dispatch(loginSuccess(guestRes.data));
        // The API interceptor will automatically use the new token from localStorage
      }

      let imageUrl = null;
      if (problemImage) {
        const formData = new FormData();
        formData.append('image', problemImage);
        const uploadRes = await API.post('/bookings/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.image_url;
      }

      // Time conversion
      const timeParts = selectedTime.split(' ');
      const [hr, min] = timeParts[0].split(':');
      let hour = parseInt(hr, 10);
      if (timeParts[1] === 'PM' && hour !== 12) hour += 12;
      if (timeParts[1] === 'AM' && hour === 12) hour = 0;
      
      const scheduleDt = new Date(selectedDate);
      scheduleDt.setHours(hour, parseInt(min, 10), 0, 0);

      const payload = {
        scheduled_time: scheduleDt.toISOString(),
        address: {
          city_id: savedAddress.cityId,
          area_id: savedAddress.areaId,
          address_line1: savedAddress.line
        },
        phone_number: phone,
        problem_message: problemMessage,
        problem_image_url: imageUrl,
        items: [
          {
            service_id: service?.id,
            quantity: quantity,
            price: service?.base_price || 1500
          }
        ]
      };

      const res = await API.post('/bookings', payload);
      toast.success(
        <div>
          <p className="font-bold mb-1">Booking confirmed!</p>
          <p className="text-sm">Your Tracking ID is <strong>{res.data.booking_id}</strong>. You can view it in your dashboard.</p>
        </div>, 
        {
          duration: 6000,
          style: { background: '#00674F', color: '#fff' }
        }
      );
      setTimeout(() => {
        navigate('/dashboard');
      }, 4000);

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-[#878787] animate-pulse">Loading Checkout...</div>;

  const currentMonthYear = selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';
  const totalPrice = Number(service?.base_price || 1500) * quantity;

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 antialiased pb-28">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            
            {/* 1. Date & Time Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mr-3 tracking-tight">Select Date and Time</h2>
                <span className="text-sm text-gray-500 font-medium flex items-center bg-gray-50 px-3 py-1 rounded-full">
                  📅 {currentMonthYear}
                </span>
              </div>
              
              {/* Dates Row */}
              <div className="flex overflow-x-auto gap-3 pb-3 mb-5 scrollbar-hide snap-x">
                {dates.map((d, i) => {
                  const isSelected = selectedDate?.toDateString() === d.toDateString();
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedDate(d)}
                      className={`snap-start shrink-0 flex flex-col items-center justify-center w-[75px] h-[85px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        isSelected 
                        ? 'bg-[#00674F] text-white border-[#00674F] shadow-md shadow-[#00674F]/20 transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#00674F]/40 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-semibold tracking-wide uppercase mb-1">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-xl font-extrabold">{d.getDate()}</span>
                    </div>
                  );
                })}
              </div>

              {/* Times Row */}
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
                {times.map((t, i) => {
                  const isSelected = selectedTime === t;
                  const [timeStr, period] = t.split(' ');
                  return (
                    <div 
                      key={i}
                      onClick={() => setSelectedTime(t)}
                      className={`snap-start shrink-0 flex flex-col items-center justify-center w-[85px] h-[65px] rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                        isSelected 
                        ? 'bg-[#00674F] text-white border-[#00674F] shadow-md shadow-[#00674F]/20 transform scale-105' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-[#00674F]/40 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-sm tracking-tight">{timeStr}</span>
                      <span className="text-[10px] font-bold tracking-widest">{period}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Contact & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Phone Input Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900 tracking-tight">Phone Number*</span>
                  <button onClick={() => setIsEditingPhone(true)} className="text-[#00674F] opacity-70 hover:opacity-100 transition-opacity">
                    <Edit2 size={18} />
                  </button>
                </div>
                {isEditingPhone ? (
                  <input 
                    type="text" 
                    placeholder="e.g. 03001234567" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    onBlur={() => phone.length >= 11 && setIsEditingPhone(false)}
                    className="w-full border-2 border-[#00674F]/30 rounded-xl p-3 focus:outline-none focus:border-[#00674F] text-gray-800 font-medium transition-colors"
                  />
                ) : (
                  <div 
                    onClick={() => setIsEditingPhone(true)}
                    className="w-full bg-gray-50 border border-transparent rounded-xl p-3 text-gray-700 font-medium cursor-pointer group-hover:bg-[#00674F]/5 transition-colors"
                  >
                    {phone || <span className="text-red-400 italic font-normal">Required* (Click to edit)</span>}
                  </div>
                )}
              </div>

              {/* Address Box */}
              <div className="bg-[#f8f9fc] border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-gray-900 tracking-tight">Address*</span>
                  <button 
                    onClick={() => setShowAddressModal(true)} 
                    className="text-[#00674F] text-sm font-bold flex items-center gap-1.5 hover:underline decoration-2 underline-offset-2"
                  >
                    {savedAddress ? 'Edit' : 'Add New'} 
                    <span className="bg-[#00674F] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm">▼</span>
                  </button>
                </div>
                <div className="text-gray-600 text-sm font-medium leading-relaxed">
                  {savedAddress ? (
                    <span><span className="text-gray-900">{savedAddress.line}</span>, {savedAddress.displayArea}</span>
                  ) : (
                    <span className="text-red-400 italic">Address is required to proceed</span>
                  )}
                </div>
              </div>

            </div>

            {/* 3. Items Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5 tracking-tight">Items</h3>
              <div className="border border-[#00674F]/20 hover:border-[#00674F]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-5 w-full md:max-w-md transition-colors bg-[#00674F]/[0.02]">
                <div className="w-24 h-24 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-gray-100 p-1">
                  {service?.image_url ? (
                    <img src={service.image_url.startsWith('http') ? service.image_url : `${mediaBaseUrl}/${service.image_url}`} alt={service.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400 rounded-lg">No Img</div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-[#00674F] font-bold mb-1.5 leading-snug">{service?.name}</h4>
                  <div className="text-sm font-extrabold text-gray-900 mb-3 flex items-center justify-center sm:justify-start gap-2">
                    <span className="line-through text-gray-400 font-medium text-xs">Rs:{Number(service?.base_price) + 100}</span>
                    <span className="text-lg">Rs:{service?.base_price}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="w-8 h-8 bg-[#00674F] hover:bg-[#004f3d] text-white rounded-lg flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                    ><Minus size={16} strokeWidth={3} /></button>
                    <span className="font-bold w-6 text-center text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="w-8 h-8 bg-[#00674F] hover:bg-[#004f3d] text-white rounded-lg flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                    ><Plus size={16} strokeWidth={3} /></button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            
            {/* Billing Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-7 shadow-sm sticky top-8">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Billing</h3>
              
              <div className="flex justify-between items-center text-sm font-medium text-gray-600 mb-3 border-b border-gray-200 pb-3">
                <span className="truncate pr-4 flex-1">{service?.name} <span className="text-gray-400 ml-1">({quantity})</span></span>
                <span className="whitespace-nowrap font-semibold">Rs: {service?.base_price} X {quantity}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm font-bold text-gray-800 mb-7 border-b border-gray-200 pb-5">
                <span>Amount</span>
                <span>Rs: {totalPrice}</span>
              </div>
              
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-bold text-gray-800">Payment Method</span>
                <span className="text-xs font-bold text-[#00674F] bg-[#00674F]/10 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                  <span className="text-base">💵</span> Cash
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-2">
                <span className="text-lg font-extrabold text-gray-900">Total Price</span>
                <span className="text-xl font-black text-[#00674F]">Rs: {totalPrice}</span>
              </div>
            </div>

            {/* Problem Image Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Problem Image</h3>
              <p className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wider">Add Screenshots</p>
              
              {!imagePreview ? (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#00674F] hover:bg-[#00674F]/5 transition-colors group">
                  <ImagePlus size={24} className="text-gray-400 group-hover:text-[#00674F] transition-colors" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#00674F] shadow-sm">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={removeImage} 
                    className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors transform hover:scale-110"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              )}
            </div>

            {/* Additional Info Textarea */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
              <textarea 
                className="w-full border-2 border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:border-[#00674F] min-h-[120px] resize-y bg-gray-50 placeholder-gray-400 font-medium text-gray-800 transition-colors"
                placeholder="Problem message or instructions for the provider..."
                value={problemMessage}
                onChange={e => setProblemMessage(e.target.value)}
              />
            </div>

          </div>
        </div>
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="container mx-auto max-w-7xl flex justify-end">
          <button 
            onClick={handlePlaceOrder}
            disabled={submitting}
            className={`group bg-[#185BCE] hover:bg-[#1249a6] text-white px-7 py-3.5 rounded-xl font-bold flex items-center justify-between gap-6 transition-all duration-300 active:scale-95 shadow-xl shadow-[#185BCE]/20 min-w-[280px] ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
          >
            <div className="border border-white/30 bg-white/10 rounded-lg px-3 py-1 flex items-center justify-center shadow-inner">
              <span className="text-sm font-extrabold">{quantity}</span>
            </div>
            <span className="text-lg font-black tracking-wide">Rs {totalPrice}</span>
            <span className="flex-1 text-right flex items-center justify-end gap-1 text-[15px]">
              {submitting ? 'Placing...' : 'Place Order'} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-7 shadow-2xl animate-slide-up border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <div className="w-10 h-10 bg-[#00674F]/10 rounded-full flex items-center justify-center">
                  <MapPin className="text-[#00674F]" size={20} />
                </div>
                Add Address
              </h3>
              <button 
                onClick={() => setShowAddressModal(false)} 
                className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">City</label>
                <select 
                  className="w-full border-2 border-gray-100 rounded-xl p-3.5 outline-none bg-gray-100 text-gray-500 font-semibold cursor-not-allowed appearance-none"
                  value={selectedCityId} 
                  onChange={e => setSelectedCityId(e.target.value)}
                  disabled
                >
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Area <span className="text-red-500">*</span></label>
                <select 
                  className="w-full border-2 border-gray-200 rounded-xl p-3.5 outline-none focus:border-[#00674F] focus:ring-4 focus:ring-[#00674F]/10 transition-all font-medium text-gray-800 appearance-none bg-white"
                  value={selectedAreaId} 
                  onChange={e => setSelectedAreaId(e.target.value)}
                >
                  <option value="" disabled>Select your Area</option>
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Address Details <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. House No 3, Street 4, Phase 1..." 
                  className="w-full border-2 border-gray-200 rounded-xl p-3.5 outline-none focus:border-[#00674F] focus:ring-4 focus:ring-[#00674F]/10 transition-all font-medium text-gray-800"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handleSaveAddress}
                className="w-full bg-[#00674F] hover:bg-[#00523f] text-white font-extrabold text-lg py-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(0,103,79,0.2)] active:scale-95 active:shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
