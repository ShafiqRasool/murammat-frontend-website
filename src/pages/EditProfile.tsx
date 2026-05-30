import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import API from '../utils/api';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';
import { useData } from '../Context/DataContext';
import { useNavigate } from 'react-router-dom';

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
  const [cityId, setCityId] = useState('');
  const [areaId, setAreaId] = useState('');

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
          setAddressLine1(data.address_line1 || '');
          setCityId(data.city_id || '');
          setAreaId(data.area_id || '');
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
        await API.put('/profile/customer', {
          first_name: firstName,
          last_name: lastName,
          address_line1: addressLine1,
          city_id: cityId,
          area_id: areaId,
        });
        setSuccess('Profile updated successfully!');
      } else {
        await API.put('/profile/provider', {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          phone,
          email,
          service_ids: serviceIds,
        });
        setSuccess('Profile updated successfully! Note: You will need to be re-approved by the admin.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile.');
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
              <Input label="Address Line 1" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#878787]">City</label>
                  <select required value={cityId} onChange={(e) => { setCityId(e.target.value); setAreaId(''); }} className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F] shadow-sm transition-all duration-300">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[#878787]">Area</label>
                  <select required value={areaId} onChange={(e) => setAreaId(e.target.value)} className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F] shadow-sm transition-all duration-300 disabled:opacity-50" disabled={!cityId}>
                    <option value="">Select Area</option>
                    {getAreasByCity(cityId).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
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
