import React, { useState } from 'react';
import { Search, MapPin, Package, Calendar, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
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

  const getStatusDisplay = (status: string) => {
    const statusSteps = [
      { id: 'pending', label: 'Order Placed', color: 'bg-yellow-500' },
      { id: 'assigned', label: 'Provider Assigned', color: 'bg-blue-500' },
      { id: 'accepted', label: 'Accepted by Provider', color: 'bg-indigo-500' },
      { id: 'in_progress', label: 'Work In Progress', color: 'bg-purple-500' },
      { id: 'completed', label: 'Completed', color: 'bg-[#00674F]' }
    ];

    if (status === 'cancelled') {
      return (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-center">
          <span className="text-red-600 font-bold text-lg">This order has been cancelled.</span>
        </div>
      );
    }

    const currentIndex = statusSteps.findIndex(s => s.id === status);
    
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Order Status</h3>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6 md:gap-0">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full mx-10 z-0"></div>
          
          {/* Active Progress Line */}
          {currentIndex >= 0 && (
            <div 
              className="hidden md:block absolute top-1/2 left-0 h-1 bg-[#00674F] -translate-y-1/2 rounded-full mx-10 z-0 transition-all duration-1000"
              style={{ width: `calc(${(currentIndex / (statusSteps.length - 1)) * 100}% - 5rem)` }}
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
                      ? 'bg-[#00674F] text-white ring-4 ring-[#00674F]/20 scale-110' 
                      : 'bg-[#00674F] text-white'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'}`}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : index + 1}
                </div>
                <div className={`flex flex-col md:items-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  <span className={`text-sm font-bold ${isCurrent ? 'text-[#00674F]' : ''}`}>{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-4xl animate-fade-in">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Track Your Order</h1>
          <p className="text-gray-500 text-lg">Enter your unique tracking ID to see the live status of your service.</p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 transform hover:shadow-md transition-shadow">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-[#00674F] font-medium transition-colors"
                placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-4 bg-[#00674F] hover:bg-[#00523f] text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-[#00674F]/20 active:scale-95 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="text-[#00674F]" /> Service Details
                </h3>
                
                <div className="space-y-4">
                  {orderData.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">{item.service_name}</p>
                        <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#00674F]">Rs {item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-500">Total Amount</span>
                    <span className="text-2xl font-black text-gray-900 flex items-center gap-2">
                      <CreditCard size={20} className="text-gray-400" />
                      Rs {orderData.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Schedule & Location */}
              <div className="space-y-8">
                
                {/* Schedule Card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Calendar className="text-[#00674F]" /> Schedule Info
                  </h3>
                  <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <Clock className="text-[#00674F]" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date & Time</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {new Date(orderData.scheduled_time).toLocaleString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric',
                          hour: 'numeric', minute: '2-digit', hour12: true
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <MapPin className="text-[#00674F]" /> Location
                  </h3>
                  <p className="font-medium text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-gray-900 font-bold">{orderData.address_line1}</span><br />
                    {orderData.area_name}, {orderData.city_name}
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
