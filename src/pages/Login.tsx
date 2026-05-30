import React, { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../store/authSlice';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Components/UI/Button';
import { Input } from '../Components/UI/Input';
import { Card } from '../Components/UI/Card';

export default function Login() {
  const [phone, setPhone] = useState('+92');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 13 || !phone.startsWith('+923')) {
      setError('Please enter a valid Pakistani phone number (e.g., +923001234567)');
      return;
    }

    dispatch(setLoading(true));
    setError('');

    try {
      const res = await API.post('/auth/login', { phone, password });
      
      dispatch(loginSuccess({
        user: { id: res.data.user.id, email: res.data.user.email, role: res.data.user.role },
        token: res.data.token
      }));
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
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

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    dispatch(setLoading(true));
    setError('');
    try {
      const res = await API.post('/auth/google-login', { credential: credentialResponse.credential });
      dispatch(loginSuccess({
        user: { id: res.data.user.id, email: res.data.user.email, phone: res.data.user.phone, role: res.data.user.roles[0] },
        token: res.data.token
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Google login failed.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLoginError = () => {
    setError('Google Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#00674F] mb-2">Welcome Back</h2>
          <p className="text-[#878787]">Login to access your Murammat account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center animate-fade-in">
             {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input 
            label="Phone Number"
            type="tel" 
            placeholder="+923001234567"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
          <Input 
            label="Password"
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="mt-4">
            <Button type="submit" className="w-full text-lg">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#878787]">
            Don't have an account? <span className="text-[#00674F] font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register here</span>
          </p>
        </div>

      </Card>
    </div>
    </GoogleOAuthProvider>
  );
}
