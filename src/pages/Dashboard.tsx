import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Package, 
  Calendar, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const [profile, setProfile] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setProfileLoading(true);
        setError('');
        
        // 1. Fetch Bookings
        const bookingEndpoint = user.role === 'customer' ? '/bookings/customer' : '/bookings/provider';
        const bookingsRes = await API.get(bookingEndpoint);
        setBookings(bookingsRes.data);

        // 2. Fetch Profile Info
        const profileEndpoint = user.role === 'customer' ? '/profile/customer' : '/profile/provider';
        const profileRes = await API.get(profileEndpoint);
        setProfile(profileRes.data);

        // 3. Fetch Address Info (for Customer only)
        if (user.role === 'customer') {
          const addressRes = await API.get('/addresses');
          if (addressRes.data && addressRes.data.length > 0) {
            const defaultAddress = addressRes.data.find((a: any) => a.is_default) || addressRes.data[0];
            setAddress(defaultAddress);
          }
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
        setProfileLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center text-red-500 font-bold">
        You must be logged in to view the dashboard.
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
      case 'Technician Assigned': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'Work Started': return 'bg-purple-50 text-purple-700 border border-purple-100';
      case 'Repair': return 'bg-orange-50 text-orange-700 border border-orange-100';
      case 'Work Done': return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'BookingDone':
      case 'Rated & Reviewed': return 'bg-green-50 text-[#00674F] border border-green-150';
      case 'cancelled': return 'bg-red-50 text-red-700 border border-red-100';
      default: return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  const getStatusLineColor = (status: string) => {
    switch (status) {
      case 'pending': return 'from-yellow-400 to-amber-300';
      case 'Technician Assigned': return 'from-blue-400 to-cyan-400';
      case 'Work Started': return 'from-purple-400 to-fuchsia-400';
      case 'Repair': return 'from-orange-400 to-amber-400';
      case 'Work Done': return 'from-indigo-400 to-violet-400';
      case 'BookingDone':
      case 'Rated & Reviewed': return 'from-[#00674F] to-[#009b77]';
      case 'cancelled': return 'from-red-400 to-rose-450';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await API.post(`/bookings/${bookingId}/status`, { status });
      // Reload bookings
      const response = await API.get('/bookings/provider');
      setBookings(response.data);
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'Technician Assigned': return 1;
      case 'Work Started': return 2;
      case 'Repair': return 2;
      case 'Work Done': return 3;
      case 'BookingDone':
      case 'Rated & Reviewed': return 4;
      default: return 0;
    }
  };

  const getStatusStepper = (status: string) => {
    const statusSteps = [
      { id: 'pending', label: 'Order Placed' },
      { id: 'Technician Assigned', label: 'Technician Assigned' },
      { id: 'Work Started', label: 'Work In Progress' },
      { id: 'Work Done', label: 'Work Completed' },
      { id: 'BookingDone', label: 'Completed' }
    ];

    if (status === 'cancelled') {
      return (
        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex items-center justify-center text-red-650 font-bold text-sm">
          ❌ This order has been cancelled.
        </div>
      );
    }

    const currentIndex = getStatusIndex(status);
    
    return (
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0 mt-2 bg-slate-50 p-5 rounded-2xl border border-gray-150">
        {/* Progress Line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 rounded-full mx-8 z-0"></div>
        
        {/* Active Progress Line */}
        {currentIndex >= 0 && (
          <div 
            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-[#00674F] -translate-y-1/2 rounded-full mx-8 z-0 transition-all duration-1000"
            style={{ width: `calc(${(currentIndex / (statusSteps.length - 1)) * 100}% - 4rem)` }}
          ></div>
        )}

        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto">
              {/* Vertical Line for Mobile */}
              {index < statusSteps.length - 1 && (
                <div className="md:hidden absolute left-3.5 top-7 bottom-[-20px] w-0.5 bg-gray-200 z-0"></div>
              )}
              {index < currentIndex && (
                <div className="md:hidden absolute left-3.5 top-7 bottom-[-20px] w-0.5 bg-[#00674F] z-0"></div>
              )}

              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm
                ${isCompleted 
                  ? isCurrent 
                    ? 'bg-[#00674F] text-white ring-4 ring-[#00674F]/20 scale-105' 
                    : 'bg-[#00674F] text-white' 
                  : 'bg-white text-gray-400 border border-gray-250'}`}
              >
                {isCompleted ? <CheckCircle2 size={14} className="stroke-[2.5]" /> : index + 1}
              </div>
              <div className={`flex flex-col md:items-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                <span className={`text-[10px] font-bold md:text-center tracking-tight ${isCurrent ? 'text-[#00674F] text-[11px]' : ''}`}>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-emerald-50/20 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background blurs */}
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight capitalize">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00674F] to-[#009b77]">{profile?.first_name || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              {user?.role === 'customer' 
                ? 'Here is an overview of your recent service bookings.' 
                : 'Here is an overview of your assigned jobs.'}
            </p>
          </div>
        </div>

        {/* Profile Info Header Card */}
        {!profileLoading && profile && (
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-gray-150 p-6 md:p-8 shadow-xl shadow-gray-200/30 relative overflow-hidden">
            {/* Accent gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ffc4] via-[#00674F] to-yellow-450"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Initials Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00674F] to-[#009b77] text-white flex items-center justify-center text-2xl font-extrabold uppercase shadow-lg border border-white/20 flex-shrink-0">
                  {profile.first_name ? profile.first_name.charAt(0) : (profile.email ? profile.email.charAt(0) : 'U')}
                </div>
                
                <div className="text-center sm:text-left space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h2 className="text-xl font-black text-gray-900 capitalize leading-tight">
                      {profile.first_name || 'Customer'} {profile.last_name || ''}
                    </h2>
                    <span className="text-[10px] px-3 py-0.5 rounded-full font-extrabold bg-[#00674F]/10 text-[#00674F] uppercase tracking-wider border border-[#00674F]/20">
                      {user?.role}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-gray-500 font-bold tracking-wide">
                    {profile.email && (
                      <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <Mail size={13} className="text-gray-400" />
                        {profile.email}
                      </span>
                    )}
                    {profile.phone && (
                      <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <Phone size={13} className="text-gray-400" />
                        {profile.phone}
                      </span>
                    )}
                  </div>

                  {user?.role === 'customer' && address && (
                    <div className="mt-3 text-xs text-gray-650 bg-slate-50 border border-gray-150 p-4 rounded-2xl max-w-xl text-left space-y-1">
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1.5 text-[9px] uppercase tracking-wider">
                        <MapPin size={11} /> Default Service Address
                      </span>
                      <p className="font-bold text-gray-900 leading-snug">{address.address_line1}</p>
                      {address.area_name && (
                        <p className="text-[10px] text-gray-500 font-medium">{address.area_name}, {address.city_name}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Link 
                to="/profile" 
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-emerald-50 border border-gray-250 hover:border-emerald-250 text-[#00674F] font-bold rounded-xl transition-all duration-300 text-xs shadow-sm hover:-translate-y-0.5 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50/50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-semibold">
            <span>{error}</span>
          </div>
        )}

        {/* Bookings / Assigned Jobs Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package size={20} className="text-[#00674F]" />
            <span>{user?.role === 'customer' ? 'My Bookings History' : 'Assigned Jobs'}</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-gray-100 h-56 rounded-3xl border border-gray-200"></div>
               ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm max-w-xl mx-auto space-y-4">
              <div className="w-14 h-14 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <FileText size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No bookings found</h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {user?.role === 'customer' 
                  ? "You haven't booked any home services yet." 
                  : "You have no assigned jobs at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-200/40 cursor-pointer border border-gray-150 hover:border-[#00674F]/30 relative overflow-hidden flex flex-col justify-between"
                  onClick={() => setSelectedBooking(booking)}
                >
                  {/* Status Indicator Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getStatusLineColor(booking.status)}`}></div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold capitalize ${getStatusBadgeColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-405 font-extrabold tracking-tight">
                        {new Date(booking.scheduled_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-2.5">Requested Services</h4>
                      <ul className="text-xs text-gray-600 space-y-2">
                        {booking.items.map((item: any, idx: number) => (
                          <li key={idx} className="flex justify-between border-b border-gray-50 pb-1.5">
                            <span className="font-semibold text-gray-700 capitalize">{item.quantity}x {item.service_name || 'Service'}</span>
                            <span className="font-bold text-gray-900">Rs. {Number(item.price * item.quantity).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <div className="pt-3 border-t border-gray-50 flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400">Total Amount</span>
                      <span className="font-black text-[#00674F] text-base">
                        Rs. {Number(booking.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)).toLocaleString()}
                      </span>
                    </div>

                    {user?.role === 'provider' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {booking.status === 'assigned' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateBookingStatus(booking.id, 'accepted');
                            }}
                            className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
                          >
                            Accept Job
                          </button>
                        )}
                        {booking.status === 'accepted' && (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               updateBookingStatus(booking.id, 'in_progress');
                             }}
                             className="w-full py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer shadow-md"
                           >
                             Start Work
                           </button>
                        )}
                        {booking.status === 'in_progress' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateBookingStatus(booking.id, 'completed');
                            }}
                            className="w-full py-2 bg-[#00674F] text-white rounded-xl text-xs font-bold hover:bg-[#00523f] transition-colors cursor-pointer shadow-md"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    )}

                    <div className="pt-2 text-center">
                      <span className="text-[10px] font-bold text-[#00674F] hover:underline uppercase tracking-wider">
                        {user?.role === 'customer' ? 'Track Live Order' : 'Complete Details'} &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Booking Modal Dialog (Redesigned Glassmorphic) */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white/95 backdrop-blur-md rounded-3xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top brand line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ffc4] via-[#00674F] to-yellow-400"></div>

            {/* Close Button */}
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Title */}
            <div className="mb-6 border-b border-gray-100 pb-3">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Order Details</h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Live tracking overview</p>
            </div>

            {/* Stepper Status Progress */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Live Status Tracking</h3>
              {getStatusStepper(selectedBooking.status)}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Service & Schedule */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock size={12} className="text-[#00674F]" /> Scheduled Date & Time
                  </p>
                  <p className="font-extrabold text-gray-900 text-sm">
                    {new Date(selectedBooking.scheduled_time).toLocaleString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit', hour12: true
                    })}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#00674F]" /> Service Address
                  </p>
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedBooking.address_line1}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {selectedBooking.area_name}, {selectedBooking.city_name}
                  </p>
                </div>
              </div>

              {/* Booking Summary / Items */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Package size={12} className="text-[#00674F]" /> Requested Items
                  </p>
                  <ul className="text-xs text-gray-600 space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedBooking.items.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between border-b border-gray-200/50 pb-1.5">
                        <span className="font-medium text-gray-700 capitalize">{item.quantity}x {item.service_name || 'Service'}</span>
                        <span className="font-bold text-gray-900">Rs. {Number(item.price * item.quantity).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-gray-250 mt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400">Total Amount</span>
                  <span className="text-lg font-black text-[#00674F]">
                    Rs. {Number(selectedBooking.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#00523f] hover:to-[#00aa82] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer uppercase tracking-wider hover:-translate-y-0.5 active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
