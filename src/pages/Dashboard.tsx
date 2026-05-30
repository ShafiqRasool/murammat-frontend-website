import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import API from '../utils/api';
import { Card } from '../Components/UI/Card';

export default function Dashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const endpoint = user.role === 'customer' ? '/bookings/customer' : '/bookings/provider';
        const response = await API.get(endpoint);
        setBookings(response.data);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError('Failed to fetch dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#00674F]">
          Welcome back, {user?.email?.split('@')[0]}
        </h1>
        <p className="text-gray-500 mt-2">
          {user?.role === 'customer' 
            ? 'Here is an overview of your recent service bookings.' 
            : 'Here is an overview of your assigned jobs.'}
        </p>
      </div>

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
            <Card key={booking.id} className="p-6 transition-transform hover:scale-[1.01] hover:shadow-lg">
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
                  onClick={() => {
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
                      onClick={() => updateBookingStatus(booking.id, 'accepted')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                      Accept Job
                    </button>
                  )}
                  {booking.status === 'accepted' && (
                     <button 
                       onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                       className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                     >
                       Start Work
                     </button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 w-full"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
