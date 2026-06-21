import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../Components/UI/Input';
import { useData } from '../Context/DataContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { completeRegistration } from '../store/authSlice';
import { ShieldCheck, User, MapPin, Search, Navigation } from 'lucide-react';
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

export default function Register() {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { cities, getAreasByCity } = useData();
  
  // Profile Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Location Fields
  const [addressLine1, setAddressLine1] = useState('');
  const [latitude, setLatitude] = useState<number | null>(31.5204);
  const [longitude, setLongitude] = useState<number | null>(74.3587);

  // Map Refs & State
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/my-profile';

  // Load Google Map on Mount
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (!mapRef.current) return;
      const google = (window as any).google;
      const initialLocation = { lat: 31.5204, lng: 74.3587 }; // Lahore

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
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required');
      return;
    }
    if (!addressLine1.trim()) {
      setError('Address details are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create/Update Profile
      await API.post('/profile/customer', {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || null
      });

      const defaultCityId = cities[0]?.id || 'ccc11111-1111-4111-8111-111111111111';
      const defaultAreaId = getAreasByCity(defaultCityId)[0]?.id || 'aaa11111-1111-4111-8111-111111111111';

      // 2. Add Address
      await API.post('/addresses', {
        address_line1: addressLine1.trim(),
        city_id: defaultCityId,
        area_id: defaultAreaId,
        latitude,
        longitude
      });

      const updatedUser = authUser 
        ? { ...authUser, email: email.trim() || authUser.email }
        : { id: '', email: email.trim(), role: 'customer' };
      dispatch(completeRegistration({ user: updatedUser }));

      toast.success('Registration completed successfully!');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      {/* Animated GPU background blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#009b77]/10 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }}
      ></div>
      
      {/* Custom mesh grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10">
        
        {/* Registration Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Complete Registration</h2>
          <p className="text-gray-500 text-sm">Tell us a bit more about yourself to set up your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-6 text-xs text-center font-medium animate-fade-in">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Personal Information */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
              <User size={18} className="text-[#00674F]" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                required 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11 bg-white/60 focus:bg-white rounded-xl text-sm"
              />
              <Input 
                label="Last Name" 
                required 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                className="h-11 bg-white/60 focus:bg-white rounded-xl text-sm"
              />
            </div>
            
            <Input 
              label="Email Address (Optional)" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-white/60 focus:bg-white rounded-xl text-sm"
            />
          </div>

          {/* Address & Location */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
              <MapPin size={18} className="text-[#00674F]" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Address & Location</h3>
            </div>
            
            <Input 
              label="Address Details" 
              required 
              value={addressLine1} 
              onChange={(e) => setAddressLine1(e.target.value)} 
              placeholder="House #, Street name, Block"
              className="h-11 bg-white/60 focus:bg-white rounded-xl text-sm"
            />
          </div>

          {/* Map Location Picker */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Pin Exact Location on Map</span>
              <span className="text-red-500">*</span>
            </label>
            
            {/* Search Location Bar */}
            <div className="flex gap-2 mb-1">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search location on map..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00674F]/20 focus:border-[#00674F] text-sm bg-white/60 focus:bg-white transition-all h-11"
                />
              </div>
              <button 
                type="button" 
                onClick={handleSearchLocation} 
                className="h-11 px-6 bg-[#00674F] hover:bg-[#005440] text-white font-bold rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#00674F]/10 active:scale-98"
              >
                <Search size={16} />
                <span>Search</span>
              </button>
            </div>

            {/* Map Container */}
            <div 
              ref={mapRef} 
              className="w-full h-64 rounded-2xl border border-gray-200 overflow-hidden shadow-inner bg-gray-100" 
            />

            {/* Current Location Button */}
            <button 
              type="button" 
              onClick={handleCurrentLocation} 
              className="w-full flex items-center justify-center gap-2 border border-dashed border-[#00674F] text-[#00674F] hover:bg-[#00674F]/5 rounded-xl font-bold text-xs py-3 transition-all duration-300 active:scale-98 cursor-pointer"
            >
              <Navigation size={14} className={isLocating ? "animate-spin" : ""} />
              <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#005440] hover:to-[#008263] text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,103,79,0.3)] hover:shadow-[0_6px_20px_rgba(0,103,79,0.2)] active:scale-98 cursor-pointer mt-4"
          >
            {loading ? 'Completing...' : 'Complete Registration'}
          </button>
        </form>

        {/* Secured stamp banner */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-[#00674F]" />
          <span>Secured by Murammat.pk</span>
        </div>

      </div>
    </div>
  );
}
