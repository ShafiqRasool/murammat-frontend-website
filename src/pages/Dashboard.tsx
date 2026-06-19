import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import API from '../utils/api';
import { Card } from '../Components/UI/Card';
import { Link } from 'react-router-dom';

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
      <div className="p-10 text-center text-red-500">
        You must be logged in to view the dashboard.
      </div>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-indigo-100 text-indigo-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusStepper = (status: string) => {
    const statusSteps = [
      { id: 'pending', label: 'Order Placed' },
      { id: 'assigned', label: 'Provider Assigned' },
      { id: 'accepted', label: 'Accepted by Provider' },
      { id: 'in_progress', label: 'Work In Progress' },
      { id: 'completed', label: 'Completed' }
    ];

    if (status === 'cancelled') {
      return (
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center justify-center">
          <span className="text-red-600 font-bold text-sm">This order has been cancelled.</span>
        </div>
      );
    }

    const currentIndex = statusSteps.findIndex(s => s.id === status);
    
    return (
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4 md:gap-0 mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
        {/* Progress Line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-250 -translate-y-1/2 rounded-full mx-6 z-0"></div>
        
        {/* Active Progress Line */}
        {currentIndex >= 0 && (
          <div 
            className="hidden md:block absolute top-1/2 left-0 h-0.5 bg-[#00674F] -translate-y-1/2 rounded-full mx-6 z-0 transition-all duration-500"
            style={{ width: `calc(${(currentIndex / (statusSteps.length - 1)) * 100}% - 3rem)` }}
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
                  : 'bg-white text-gray-400 border border-gray-200'}`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <div className={`flex flex-col md:items-center ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                <span className={`text-[11px] font-bold md:text-center ${isCurrent ? 'text-[#00674F]' : ''}`}>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#00674F]">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-gray-500 mt-2">
            {user?.role === 'customer' 
              ? 'Here is an overview of your recent service bookings.' 
              : 'Here is an overview of your assigned jobs.'}
          </p>
        </div>
      </div>

      {/* Profile Info Card */}
      {!profileLoading && profile && (
        <Card className="p-6 mb-8 border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-[#00674F] text-white flex items-center justify-center text-2xl font-bold uppercase shadow-md flex-shrink-0">
                {profile.first_name ? profile.first_name.charAt(0) : (profile.email ? profile.email.charAt(0) : 'U')}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-extrabold text-gray-900 capitalize flex items-center gap-2 justify-center md:justify-start">
                  {profile.first_name || 'Customer'} {profile.last_name || ''}
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#00674F]/10 text-[#00674F] uppercase tracking-wider">
                    {user?.role}
                  </span>
                </h2>
                <div className="mt-2 flex flex-col md:flex-row gap-2 md:gap-6 text-sm text-gray-500 font-medium">
                  {profile.email && (
                    <span className="flex items-center gap-1.5 justify-center md:justify-start">
                      ✉️ {profile.email}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1.5 justify-center md:justify-start">
                      📞 {profile.phone}
                    </span>
                  )}
                </div>
                {user?.role === 'customer' && address && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50/50 border border-gray-100 p-3 rounded-xl max-w-xl text-left">
                    <span className="font-bold text-gray-800 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                      📍 Default Address
                    </span>
                    <span className="font-semibold">{address.address_line1}</span>
                    {address.area_name && <span className="text-xs text-gray-500 block mt-0.5">{address.area_name}, {address.city_name}</span>}
                  </div>
                )}
              </div>
            </div>
            <Link 
              to="/profile" 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#00674F] text-[#00674F] hover:bg-[#00674F] hover:text-white font-extrabold rounded-xl transition-all duration-300 text-sm active:scale-95 shadow-sm"
            >
              ✏️ Edit Profile
            </Link>
          </div>
        </Card>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
           ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card className="text-center p-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-500">
            {user?.role === 'customer' 
              ? 'You haven\'t booked any services yet.' 
              : 'You have no assigned jobs at the moment.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking: any) => (
            <Card 
              key={booking.id} 
              className="p-6 transition-all hover:scale-[1.01] hover:shadow-lg cursor-pointer border hover:border-[#00674F]"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeColor(booking.status)}`}>
                  {booking.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {new Date(booking.scheduled_time).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Tracking ID</span>
                  <span className="text-sm font-mono font-bold text-gray-800">{booking.id}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(booking.id);
                    alert('Tracking ID copied to clipboard!');
                  }}
                  className="text-[#00674F] hover:text-[#00523f] p-2 hover:bg-[#00674F]/10 rounded-lg transition-colors"
                  title="Copy Tracking ID"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-lg text-gray-800 mb-2">Requested Services</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {booking.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between border-b pb-1">
                      <span>{item.quantity}x {item.service_name || 'Service'}</span>
                      <span className="font-medium">Rs. {item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {user?.role === 'provider' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
                  {booking.status === 'assigned' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBookingStatus(booking.id, 'accepted');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
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
                       className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
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
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 w-full"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              )}

              <div className="mt-4 pt-3 border-t text-center">
                <span className="text-xs font-semibold text-[#00674F] hover:underline">
                  {user?.role === 'customer' ? 'Click to track live order status' : 'Click to view complete job details'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Booking Modal */}
      {selectedBooking && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedBooking(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Details</h2>
              <p className="text-sm text-gray-500 font-mono">Tracking ID: {selectedBooking.id}</p>
            </div>

            {/* Stepper Status Progress */}
            <div className="mb-8">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Live Status Tracking</h3>
              {getStatusStepper(selectedBooking.status)}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Service & Schedule */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Scheduled Date & Time</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {new Date(selectedBooking.scheduled_time).toLocaleString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: 'numeric', minute: '2-digit', hour12: true
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Service Address</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedBooking.address_line1}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {selectedBooking.area_name}, {selectedBooking.city_name}
                  </p>
                </div>
              </div>

              {/* Booking Summary / Items */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Requested Items</p>
                  <ul className="text-xs text-gray-600 space-y-2 max-h-36 overflow-y-auto pr-1">
                    {selectedBooking.items.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between border-b pb-1">
                        <span>{item.quantity}x {item.service_name || 'Service'}</span>
                        <span className="font-medium">Rs. {item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-gray-200 mt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Total Amount</span>
                  <span className="text-lg font-black text-[#00674F]">
                    Rs. {selectedBooking.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={() => setSelectedBooking(null)}
                className="px-6 py-2 bg-[#00674F] hover:bg-[#00523f] text-white rounded-xl font-bold text-sm transition-all duration-200"
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
