import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../store/authSlice';
import API from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../Components/UI/Input';
import { ShieldCheck, Phone, ArrowLeft, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('+92');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Active countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOtpCode = async () => {
    if (phone.length !== 13 || !phone.startsWith('+923')) {
      setError('Please enter a valid Pakistani phone number (e.g., +923001234567)');
      return;
    }
    setError('');
    setIsSending(true);
    try {
      await API.post('/auth/otp/request', { phone });
      setStep(2);
      setCountdown(60); // 60 seconds resend cooldown
      toast.success('Verification code sent successfully. / تصدیقی کوڈ کامیابی کے ساتھ بھیج دیا گیا ہے۔');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtpCode();
  };

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault();
    if (countdown > 0) return;
    sendOtpCode();
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    dispatch(setLoading(true));
    setError('');

    try {
      // 1. Authenticate & verify OTP via backend
      const res = await API.post('/auth/otp/verify', { phone, code: otp });
      const token = res.data.token;
      
      localStorage.setItem('token', token); // For axios interceptor
      
      // 2. Check if customer profile exists
      try {
        await API.get('/profile/customer');
        // Profile exists — log in successfully and redirect to home/dashboard
        dispatch(loginSuccess({
          user: { id: res.data.user.id, email: res.data.user.email, phone: res.data.user.phone, role: 'customer' },
          token,
          profile_completed: true
        }));
        toast.success('Logged in successfully!');
        navigate(redirectPath);
      } catch (err: any) {
        // Profile doesn't exist — redirect to register page to complete profile
        dispatch(loginSuccess({
          user: { id: res.data.user.id, email: res.data.user.email, phone: res.data.user.phone, role: 'customer' },
          token,
          profile_completed: false
        }));
        toast.success('Please complete your profile details.');
        navigate(`/register?redirect=${encodeURIComponent(redirectPath)}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setIsVerifying(false);
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
      
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 px-8 py-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-10">
        
        {/* Brand header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-[#00674F]/10 rounded-2xl flex items-center justify-center mb-4 text-[#00674F] shadow-inner">
            {step === 1 ? <Phone size={28} /> : <KeyRound size={28} />}
          </div>
          
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            {step === 1 ? 'Verify Your Phone' : 'Enter Verification Code'}
          </h2>
          <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
            {step === 1 
              ? 'Enter your Pakistani phone number to request a secure authentication code.' 
              : 'Please type the 6-digit confirmation code we sent to your mobile.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-6 text-xs text-center font-medium animate-fade-in">
             {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-5">
            <Input 
              label="Phone Number"
              type="tel" 
              placeholder="+923001234567"
              value={phone}
              onChange={handlePhoneChange}
              required
              disabled={isSending}
              className="h-12 bg-white/60 focus:bg-white rounded-xl text-sm"
            />
            
            <button 
              type="submit" 
              disabled={isSending}
              className="w-full h-12 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#005440] hover:to-[#008263] text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,103,79,0.3)] hover:shadow-[0_6px_20px_rgba(0,103,79,0.2)] active:scale-98 cursor-pointer disabled:opacity-80 flex items-center justify-center"
            >
              {isSending ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending OTP...</span>
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
            <Input 
              label="Verification Code (OTP)"
              type="text" 
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isVerifying}
              className="h-12 bg-white/60 focus:bg-white rounded-xl text-sm tracking-[0.25em] text-center font-bold"
            />
            
            {/* Resend and Countdown indicator */}
            <div className="flex justify-between items-center px-1 text-xs">
              <span className="text-gray-500">
                {countdown > 0 ? (
                  <span>Resend code in: <span className="font-semibold text-[#00674F]">{countdown}s</span></span>
                ) : (
                  "Didn't receive the code?"
                )}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || isSending}
                className={`font-bold transition-all ${
                  countdown > 0 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-[#00674F] hover:text-[#009b77] cursor-pointer'
                }`}
              >
                {isSending ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setStep(1);
                  setError('');
                }}
                disabled={isVerifying}
                className="w-1/3 h-12 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              
              <button 
                type="submit" 
                disabled={isVerifying}
                className="flex-1 h-12 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#005440] hover:to-[#008263] text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,103,79,0.3)] hover:shadow-[0_6px_20px_rgba(0,103,79,0.2)] active:scale-98 cursor-pointer disabled:opacity-80 flex items-center justify-center"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying...</span>
                  </span>
                ) : (
                  'Verify & Sign In'
                )}
              </button>
            </div>
          </form>
        )}
        
        {/* Brand quality stamp */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          <ShieldCheck size={14} className="text-[#00674F]" />
          <span>Secured by Murammat.pk</span>
        </div>

      </div>
    </div>
  );
}
