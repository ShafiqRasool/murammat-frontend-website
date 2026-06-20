import React, { useState } from 'react';
import { Search, MapPin, Package, Calendar, Clock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter a valid Tracking ID');
      return;
    }

    setLoading(true);
    setOrderData(null);
    try {
      const response = await API.get(`/public/track-order?id=${trackingId.trim()}`);
      setOrderData(response.data);
      toast.success('Order details found');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to track order. Please check the ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'Technician Assigned': return 1;
      case 'Work Started': return 2;
      case 'Repair': return 2; // Treat Repair as Work in Progress
      case 'Work Done': return 3;
      case 'BookingDone':
      case 'Rated & Reviewed': return 4;
      default: return 0;
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusSteps = [
      { id: 'pending', label: 'Order Placed' },
      { id: 'Technician Assigned', label: 'Technician Assigned' },
      { id: 'Work Started', label: 'Work In Progress' },
      { id: 'Work Done', label: 'Work Completed' },
      { id: 'BookingDone', label: 'Completed' }
    ];

    if (status === 'cancelled') {
      return (
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 flex items-center gap-3 justify-center text-red-700 shadow-sm">
          <AlertCircle size={24} className="text-red-500" />
          <span className="font-bold text-lg">This order has been cancelled.</span>
        </div>
      );
    }

    const currentIndex = getStatusIndex(status);
    
    return (
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-xl shadow-gray-200/40 relative overflow-hidden">
        {/* Top brand line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ffc4] via-[#00674F] to-yellow-400"></div>

        <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Order Live Status</h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 md:gap-0">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full mx-12 z-0"></div>
          
          {/* Active Progress Line */}
          {currentIndex >= 0 && (
            <div 
              className="hidden md:block absolute top-5 left-0 h-1 bg-gradient-to-r from-[#00674F] to-[#009b77] rounded-full mx-12 z-0 transition-all duration-1000"
              style={{ width: `calc(${(currentIndex / (statusSteps.length - 1)) * 100}% - 6rem)` }}
            ></div>
          )}

          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto">
                {/* Vertical Line for Mobile */}
                {index < statusSteps.length - 1 && (
                  <div className="md:hidden absolute left-5 top-12 bottom-[-24px] w-0.5 bg-gray-100 z-0"></div>
                )}
                {index < currentIndex && (
                  <div className="md:hidden absolute left-5 top-12 bottom-[-24px] w-0.5 bg-[#00674F] z-0"></div>
                )}

                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-sm
                  ${isCompleted 
                    ? isCurrent 
                      ? 'bg-gradient-to-r from-[#00674F] to-[#009b77] text-white ring-4 ring-[#00674F]/20 scale-110' 
                      : 'bg-gradient-to-r from-[#00674F] to-[#009b77] text-white'
                    : 'bg-white text-gray-400 border border-gray-200'}`}
                >
                  {isCompleted ? <CheckCircle2 size={18} className="stroke-[2.5]" /> : index + 1}
                </div>
                <div className={`flex flex-col md:items-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  <span className={`text-xs md:text-center font-bold tracking-tight ${isCurrent ? 'text-[#00674F] text-sm' : ''}`}>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 pt-28 pb-20 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Decorative gradient blur background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-4xl animate-fade-in relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#00674F] border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-inner">
            <Package size={12} className="animate-pulse" />
            Order Tracker
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Track Your Order</h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">Enter your unique tracking ID to see the live status of your service.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white/95 border border-gray-150 p-5 rounded-3xl shadow-lg shadow-gray-200/40 mb-10">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-450" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-405 focus:outline-none focus:ring-2 focus:ring-[#00ffc4]/20 focus:border-[#00674F] font-medium transition-all"
                placeholder="Enter your Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3.5 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#00523f] hover:to-[#00aa82] text-white rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {orderData && (
          <div className="space-y-8 animate-slide-up">
            
            {/* Status Flow */}
            {getStatusDisplay(orderData.status)}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Order Info */}
              <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-md space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Package className="text-[#00674F]" size={20} /> Requested Services
                </h3>
                
                <div className="space-y-4">
                  {orderData.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900 text-sm capitalize">{item.service_name}</p>
                        <p className="text-xs text-gray-500 font-bold mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#00674F] text-sm">Rs. {Number(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-500 text-sm">Total Amount</span>
                    <span className="text-xl font-black text-gray-900 flex items-center gap-2">
                      <CreditCard size={18} className="text-gray-400" />
                      Rs. {Number(orderData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Schedule & Location */}
              <div className="space-y-6">
                
                {/* Schedule Card */}
                <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <Calendar className="text-[#00674F]" size={20} /> Schedule Info
                  </h3>
                  <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-[#00674F]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date & Time</p>
                      <p className="font-bold text-gray-905 text-sm sm:text-base">
                        {new Date(orderData.scheduled_time).toLocaleString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric',
                          hour: 'numeric', minute: '2-digit', hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <MapPin className="text-[#00674F]" size={20} /> Service Address
                  </h3>
                  <div className="font-semibold text-gray-650 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100 text-sm">
                    <span className="text-gray-900 font-extrabold">{orderData.address_line1}</span><br />
                    <span className="text-xs text-gray-500 font-medium">{orderData.area_name}, {orderData.city_name}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
