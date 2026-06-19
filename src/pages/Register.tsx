import React, { useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';
import { useData } from '../Context/DataContext';
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

      toast.success('Registration completed successfully!');
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-50 py-10">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00674F] mb-2">Complete Profile</h2>
          <p className="text-[#878787]">Tell us a bit more about yourself to set up your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center animate-fade-in">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Personal Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <Input label="Email Address (Optional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Address & Location */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Address & Location</h3>
            <Input label="Address Details" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="House #, Street name" />
          </div>

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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F] h-10"
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

          <Button type="submit" className="w-full text-lg mt-4" isLoading={loading}>Complete Registration</Button>
        </form>
      </Card>
    </div>
  );
}
