import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../store/authSlice';
import API from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('+92');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 13 || !phone.startsWith('+923')) {
      setError('Please enter a valid Pakistani phone number (e.g., +923001234567)');
      return;
    }
    setError('');
    setStep(2);
    toast.success('Dummy OTP code sent! Please use 123456.');
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '123456') {
      setError('Incorrect OTP. Please enter: 123456');
      return;
    }

    dispatch(setLoading(true));
    setError('');

    try {
      // 1. Authenticate / Register via Guest Checkout
      const res = await API.post('/auth/guest-checkout', { phone });
      const token = res.data.token;
      
      localStorage.setItem('token', token); // For axios interceptor
      
      // 2. Check if customer profile exists
        try {
          await API.get('/profile/customer');
          // Profile exists — log in successfully and redirect to home/dashboard
          dispatch(loginSuccess({
            user: { id: res.data.user.id, email: res.data.user.email, phone: res.data.user.phone, role: 'customer' },
            token
          }));
          toast.success('Logged in successfully!');
          navigate(redirectPath);
        } catch (err: any) {
          // Profile doesn't exist — redirect to register page to complete profile
          dispatch(loginSuccess({
            user: { id: res.data.user.id, email: res.data.user.email, phone: res.data.user.phone, role: 'customer' },
            token
          }));
          toast.success('Please complete your profile details.');
          navigate(`/register?redirect=${encodeURIComponent(redirectPath)}`);
        }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+92')) {
      val = '+92';
    }
    const numbersOnly = val.slice(3).replace(/\D/g, '');
    val = '+92' + numbersOnly;

    if (val.length <= 13) {
      setPhone(val);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00674F] mb-2">Customer Login</h2>
          <p className="text-[#878787]">
            {step === 1 ? 'Enter your phone number to continue' : 'Enter the verification code sent to your phone'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center animate-fade-in">
             {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
            <Input 
              label="Phone Number"
              type="tel" 
              placeholder="+923001234567"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            <div className="mt-4">
              <Button type="submit" className="w-full text-lg">
                Continue
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
            <Input 
              label="Verification Code (OTP)"
              type="text" 
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="mt-4 flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="w-1/3" 
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                }}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 text-lg">
                Verify
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
