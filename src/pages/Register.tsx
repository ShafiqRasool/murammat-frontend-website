import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';
import { useData } from '../Context/DataContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { cities, services, getAreasByCity } = useData();
  
  // Step 1 State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  // Step 2 State (Customer)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [cityId, setCityId] = useState('');
  const [areaId, setAreaId] = useState('');

  // Step 2 State (Provider extra fields)
  const [companyName, setCompanyName] = useState('');
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create User
      await API.post('/users/create', { email, password, phone, role });
      
      // 2. Login to get token for profile creation
      const res = await API.post('/auth/login', { email, password });
      
      dispatch(loginSuccess({
        user: { id: res.data.user.id, email: res.data.user.email, role: res.data.user.roles[0] || role },
        token: res.data.token
      }));

      // Move to next step for profile completion
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (role === 'customer') {
        await API.post('/profile/customer', {
          first_name: firstName,
          last_name: lastName,
          address_line1: addressLine1,
          city_id: cityId,
          area_id: areaId,
        });
      } else {
        const providerRes = await API.post('/profile/provider', {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          phone, 
          email,
          service_ids: serviceIds.length > 0 ? serviceIds : ['fff11111-1111-4111-8111-111111111111'], // Fallback if none selected
        });

        if (documents.length > 0) {
          const formData = new FormData();
          formData.append('document_type', 'Verification Documents');
          
          documents.forEach(doc => {
            formData.append('documents', doc);
          });
          
          await API.post(`/profile/provider/${providerRes.data.profileId}/documents`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create profile. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (id: string) => {
    setServiceIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-50 py-10">
      <Card className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00674F] mb-2">
            {step === 1 ? 'Create Account' : 'Complete Profile'}
          </h2>
          <p className="text-[#878787]">
            {step === 1 ? 'Join Murammat today' : 'Tell us a bit more about yourself'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center animate-fade-in">
             {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStep1} className="flex flex-col gap-4 animate-fade-in">
            <Input label="Email Address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <Input label="Phone Number" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            
            <div className="flex flex-col gap-1 mb-2">
              <label className="text-sm font-semibold text-[#878787]">I am a...</label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="customer" checked={role === 'customer'} onChange={() => setRole('customer')} className="text-[#00674F] focus:ring-[#00674F]" />
                  Customer
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="provider" checked={role === 'provider'} onChange={() => setRole('provider')} className="text-[#00674F] focus:ring-[#00674F]" />
                  Service Provider (For Technician Only )
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full text-lg mt-4" isLoading={loading}>Continue</Button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="flex flex-col gap-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
               <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
               <Input label="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            {role === 'customer' && (
               <>
                 <Input label="Address" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-[#878787]">City</label>
                      <select required value={cityId} onChange={(e) => setCityId(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F]">
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-[#878787]">Area</label>
                      <select required value={areaId} onChange={(e) => setAreaId(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F]">
                        <option value="">Select Area</option>
                        {getAreasByCity(cityId).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                 </div>
               </>
            )}

            {role === 'provider' && (
               <>
                 <Input label="Company Name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                 <div className="flex flex-col gap-1 mt-2">
                    <label className="text-sm font-semibold text-[#878787]">Select Your Services</label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                      {services.length === 0 ? <p className="text-xs text-gray-500">Loading services...</p> : null}
                      {services.map(s => (
                        <label key={s.id} className="text-sm flex items-center gap-2">
                           <input type="checkbox" checked={serviceIds.includes(s.id)} onChange={() => handleServiceToggle(s.id)} className="text-[#00674F] focus:ring-[#00674F]" />
                           {s.name}
                        </label>
                      ))}
                    </div>
                 </div>

                 <div className="flex flex-col gap-1 mt-2">
                    <label className="text-sm font-semibold text-[#878787]">Upload Documents (CNIC/Licenses)</label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#00674F]" 
                      title="Upload identity and professional documents"
                    />
                    <p className="text-xs text-gray-400">You can select multiple files.</p>
                 </div>
               </>
            )}
            
            <Button type="submit" className="w-full text-lg mt-4" isLoading={loading}>Complete Registration</Button>
          </form>
        )}

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-[#878787]">
              Already have an account? <span className="text-[#00674F] font-semibold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Sign in</span>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
