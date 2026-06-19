import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import API from '../utils/api';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';
import { useData } from '../Context/DataContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const loadGoogleMapsScript = (callback: () => void) => {
  if ((window as any).google) {
    callback();
    return;
  }
  const existingScript = document.getElementById('googleMapsScript');
  if (!existingScript) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBKXixSZWYE5MqJlysVTO_rmi4Y-L_lFN8&libraries=places`;
    script.id = 'googleMapsScript';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (callback) callback();
    };
  } else {
    existingScript.addEventListener('load', callback);
  }
};

export default function EditProfile() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { cities, services, getAreasByCity } = useData();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Customer State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [latitude, setLatitude] = useState<number | null>(31.5204);
  const [longitude, setLongitude] = useState<number | null>(74.3587);
  const [addressId, setAddressId] = useState<string | null>(null);

  // Map Refs & State
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Provider State
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user.role === 'customer') {
          const res = await API.get('/profile/customer');
          const data = res.data;
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          
          // Fetch address
          try {
            const addrRes = await API.get('/addresses');
            if (addrRes.data && addrRes.data.length > 0) {
              const defaultAddr = addrRes.data.find((a: any) => a.is_default) || addrRes.data[0];
              setAddressId(defaultAddr.id);
              setAddressLine1(defaultAddr.address_line1 || '');
              if (defaultAddr.latitude !== null && defaultAddr.latitude !== undefined) {
                setLatitude(parseFloat(defaultAddr.latitude));
              }
              if (defaultAddr.longitude !== null && defaultAddr.longitude !== undefined) {
                setLongitude(parseFloat(defaultAddr.longitude));
              }
            }
          } catch (addrErr) {
            console.error('Failed to load address info', addrErr);
          }
        } else {
          const res = await API.get('/profile/provider');
          const data = res.data;
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setCompanyName(data.company_name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setServiceIds(data.service_ids || []);

          try {
            const statusRes = await API.get('/providers/online-status');
            setIsOnline(statusRes.data.is_online);
          } catch(err) {
            console.error('Failed to get online status', err);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Failed to load profile. Make sure you completed the registration.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, isAuthenticated, navigate]);

  // Load Google Map on Mount
  useEffect(() => {
    if (loading || user?.role !== 'customer') return;

    loadGoogleMapsScript(() => {
      if (!mapRef.current) return;
      const google = (window as any).google;
      const initialLocation = { lat: latitude || 31.5204, lng: longitude || 74.3587 };

      const newMap = new google.maps.Map(mapRef.current, {
        center: initialLocation,
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
      });

      const newMarker = new google.maps.Marker({
        position: initialLocation,
        map: newMap,
        draggable: true,
      });

      setMap(newMap);
      setMarker(newMarker);

      // Draggable marker listener
      newMarker.addListener('dragend', () => {
        const pos = newMarker.getPosition();
        if (pos) {
          const lat = pos.lat();
          const lng = pos.lng();
          setLatitude(lat);
          setLongitude(lng);
          reverseGeocode(lat, lng);
        }
      });

      // Map click listener to relocation pin
      newMap.addListener('click', (e: any) => {
        const pos = e.latLng;
        if (pos) {
          newMarker.setPosition(pos);
          const lat = pos.lat();
          const lng = pos.lng();
          setLatitude(lat);
          setLongitude(lng);
          reverseGeocode(lat, lng);
        }
      });
    });
  }, [loading]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBKXixSZWYE5MqJlysVTO_rmi4Y-L_lFN8`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setAddressLine1(address);
      }
    } catch (err) {
      console.error('Error reverse geocoding:', err);
    }
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=AIzaSyBKXixSZWYE5MqJlysVTO_rmi4Y-L_lFN8`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        const address = data.results[0].formatted_address;
        
        setLatitude(loc.lat);
        setLongitude(loc.lng);
        setAddressLine1(address);

        if (map && marker) {
          const google = (window as any).google;
          const pos = new google.maps.LatLng(loc.lat, loc.lng);
          map.setCenter(pos);
          marker.setPosition(pos);
        }
      } else {
        toast.error('Location not found');
      }
    } catch (err) {
      console.error('Error searching location:', err);
      toast.error('Search failed');
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);

          if (map && marker) {
            const google = (window as any).google;
            const pos = new google.maps.LatLng(lat, lng);
            map.setCenter(pos);
            marker.setPosition(pos);
          }
          reverseGeocode(lat, lng);
        },
        (err) => {
          setIsLocating(false);
          toast.error('Error getting location: ' + err.message);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const handleServiceToggle = (id: string) => {
    setServiceIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleToggleOnline = async () => {
    setStatusLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await API.patch('/providers/online-status', { is_online: !isOnline });
      setIsOnline(res.data.is_online);
      setSuccess(res.data.message || `Status updated to ${res.data.is_online ? 'online' : 'offline'}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update online status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (user?.role === 'customer') {
        // 1. Update Profile
        await API.put('/profile/customer', {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });

        // Resolve default city & area for backend validator compatibility
        const defaultCityId = cities[0]?.id || 'ccc11111-1111-4111-8111-111111111111';
        const defaultAreaId = getAreasByCity(defaultCityId)[0]?.id || 'aaa11111-1111-4111-8111-111111111111';

        // 2. Add or Update Address
        if (addressId) {
          await API.put(`/addresses/${addressId}`, {
            address_line1: addressLine1.trim(),
            city_id: defaultCityId,
            area_id: defaultAreaId,
            latitude,
            longitude
          });
        } else {
          await API.post('/addresses', {
            address_line1: addressLine1.trim(),
            city_id: defaultCityId,
            area_id: defaultAreaId,
            latitude,
            longitude
          });
        }
        
        toast.success('Profile updated successfully!');
        setSuccess('Profile updated successfully!');
      } else {
        await API.put('/profile/provider', {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          company_name: companyName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          service_ids: serviceIds,
        });
        toast.success('Profile updated successfully!');
        setSuccess('Profile updated successfully! Note: You will need to be re-approved by the admin.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
      toast.error(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00674F]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Card className="p-8 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-[#00674F] mb-6 border-b pb-4">Edit Profile</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-6 shadow-sm">
            {success}
          </div>
        )}

        {user?.role === 'provider' && (
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
            <div>
              <h3 className="text-gray-800 font-semibold text-lg">Availability Status</h3>
              <p className="text-sm text-gray-500">Toggle to show if you are available for work today. Auto resets to offline at midnight.</p>
            </div>
            <Button 
              type="button" 
              onClick={handleToggleOnline} 
              isLoading={statusLoading}
              className={`px-6 rounded-full transition-colors font-semibold ${isOnline ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' : 'bg-gray-500 hover:bg-gray-600 text-white shadow-gray-200'}`}
              style={{ backgroundColor: isOnline ? '#22c55e' : '#6b7280', color: 'white' }}
            >
              {isOnline ? '🟢 Online' : '⚫ Offline'}
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          {user?.role === 'customer' && (
            <div className="space-y-6">
              <Input label="Address Details" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="House #, Street name" />
              
              {/* Map Location Picker */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-[#878787]">Pin Exact Location on Map</label>
                
                {/* Search Location Bar */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Search location on map..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F] h-10 text-sm"
                  />
                  <Button type="button" onClick={handleSearchLocation} className="h-10 px-4">Search</Button>
                </div>

                {/* Map Container */}
                <div 
                  ref={mapRef} 
                  className="w-full h-64 rounded-xl border border-gray-300 overflow-hidden shadow-inner bg-gray-100" 
                />

                {/* Current Location Button */}
                <Button 
                  type="button" 
                  onClick={handleCurrentLocation} 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 border-dashed border-[#00674F] text-[#00674F] hover:bg-[#00674F]/5 h-10"
                >
                  {isLocating ? 'Locating...' : '📍 Use Current Location'}
                </Button>
              </div>
            </div>
          )}

          {user?.role === 'provider' && (
            <div className="space-y-6">
              <Input label="Company Name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Phone Number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <label className="text-sm font-semibold text-[#878787]">Services Provided</label>
                <div className="grid grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-inner">
                  {services.length === 0 ? <p className="text-xs text-gray-500">Loading services...</p> : null}
                  {services.map(s => (
                    <label key={s.id} className="text-sm flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-md transition-colors border border-transparent hover:border-gray-200">
                      <input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => handleServiceToggle(s.id)} className="text-[#00674F] focus:ring-[#00674F] w-4 h-4 rounded border-gray-300" />
                      <span className="font-medium text-gray-700">{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end items-center">
            <Button type="button" variant="outline" className="mr-4 px-8" onClick={() => navigate(-1)}>Back</Button>
            <Button type="submit" isLoading={saving} className="px-8 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
