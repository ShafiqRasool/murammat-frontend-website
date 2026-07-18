import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { ShieldAlert, Phone, KeyRound, CheckCircle2, ArrowLeft, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeleteAccount() {
  const [searchParams] = useSearchParams();
  const brand = searchParams.get('app') || searchParams.get('brand') || 'murammat';
  const isHsl = brand.toLowerCase() === 'hsl';

  // Branding Configurations
  const branding = {
    name: isHsl ? 'HSL - Home Service Lab' : 'Murammat App',
    email: isHsl ? 'support@hsl.com.pk' : 'support@murammat.com',
    primaryColor: isHsl ? '#6366f1' : '#00674F', // Indigo vs Teal
    primaryHover: isHsl ? '#4f46e5' : '#00523e',
    bgColor: isHsl ? 'bg-indigo-50' : 'bg-emerald-50',
    borderColor: isHsl ? 'border-indigo-100' : 'border-emerald-100',
    textColor: isHsl ? 'text-indigo-900' : 'text-emerald-900',
  };

  const [phone, setPhone] = useState('+92');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input, 3: Success
  const [agreed, setAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      toast.error('Please enter a valid phone number / برائے مہربانی درست فون نمبر درج کریں۔');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the deletion terms / آپ کو اکاؤنٹ ڈیلیٹ کرنے کی شرائط سے متفق ہونا پڑے گا۔');
      return;
    }

    setIsSending(true);
    try {
      await API.post('/auth/otp/request', { phone });
      toast.success('Verification code sent successfully! / تصدیقی کوڈ بھیج دیا گیا ہے۔');
      setStep(2);
      setCountdown(60);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Failed to send OTP code. Please try again.';
      toast.error(errMsg);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim().length < 4) {
      toast.error('Please enter a valid verification code / برائے مہربانی درست تصدیقی کوڈ درج کریں۔');
      return;
    }

    setIsDeleting(true);
    try {
      await API.post('/auth/delete-account', { phone, code });
      toast.success('Account deleted successfully. / اکاؤنٹ کامیابی سے ڈیلیٹ کر دیا گیا ہے۔');
      setStep(3);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Verification failed. Incorrect OTP code.';
      toast.error(errMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsSending(true);
    try {
      await API.post('/auth/otp/request', { phone });
      toast.success('Verification code resent successfully! / تصدیقی کوڈ دوبارہ بھیج دیا گیا ہے۔');
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send OTP code.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12`}>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Top Header Decorative Banner */}
        <div 
          className="h-3 bg-gradient-to-r" 
          style={{ backgroundImage: `linear-gradient(to right, ${branding.primaryColor}, #818cf8)` }}
        />

        <div className="p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-500 mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{branding.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Delete Account & Data / اکاؤنٹ ڈیلیٹ کریں</p>
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className={`p-4 rounded-xl ${branding.bgColor} ${branding.borderColor} border text-sm ${branding.textColor} leading-relaxed`}>
                <div className="flex gap-2">
                  <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Important Notice / اہم معلومات:</p>
                    <p className="mt-1">
                      Deleting your account will permanently wipe your profile, active bookings, history, and active balances. This action is irreversible.
                    </p>
                    <p className="mt-2 font-medium">
                      اکاؤنٹ ڈیلیٹ کرنے سے آپ کا سارا ڈیٹا، بکنگز کی ہسٹری اور ذاتی معلومات ہمیشہ کے لیے ختم کر دی جائیں گی۔ یہ عمل واپس نہیں ہو سکتا۔
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number / فون نمبر
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+923001234567"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{ '--tw-ring-color': branding.primaryColor } as any}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Include country code, e.g., +923xxxxxxxxx</p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreement"
                    name="agreement"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 rounded text-red-600 focus:ring-red-500 border-gray-300"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreement" className="font-medium text-gray-700 cursor-pointer">
                    I understand that this action is permanent.
                  </label>
                  <p className="text-gray-500">میں سمجھتا ہوں کہ یہ عمل مستقل اور ناقابل واپسی ہے۔</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 text-white font-bold rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2"
                style={{ backgroundColor: branding.primaryColor } as any}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = branding.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = branding.primaryColor}
              >
                {isSending ? 'Sending Code...' : 'Send Verification Code / کوڈ بھیجیں'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleDeleteVerify} className="space-y-6">
              <div className="text-center bg-gray-50 border border-gray-100 rounded-xl p-4">
                <span className="text-xs text-gray-400 block uppercase font-semibold">Verification Code Sent To</span>
                <span className="text-lg font-bold text-gray-800 tracking-wide mt-1 block">{phone}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 mt-2 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Phone Number
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code / تصدیقی کوڈ
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    pattern="\d*"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent tracking-widest text-center text-lg font-bold transition-all"
                    style={{ '--tw-ring-color': '#ef4444' } as any}
                  />
                </div>
              </div>

              <div className="text-center text-sm">
                {countdown > 0 ? (
                  <span className="text-gray-500 font-medium">Resend code in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSending}
                    className="font-bold hover:underline"
                    style={{ color: branding.primaryColor }}
                  >
                    Resend Code / کوڈ دوبارہ بھیجیں
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isDeleting}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isDeleting ? 'Deleting Account...' : 'Permanently Delete Account / اکاؤنٹ ختم کریں'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border border-green-100 text-green-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Account Deleted / اکاؤنٹ ڈیلیٹ ہو گیا</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Your account deletion request has been processed. All personal data associated with your phone number has been deleted from our servers.
                </p>
                <p className="text-sm font-medium text-gray-700 mt-3 leading-relaxed">
                  آپ کا اکاؤنٹ اور تمام متعلقہ ڈیٹا مستقل طور پر ڈیلیٹ کر دیا گیا ہے۔ ہمارے ساتھ کام کرنے کا شکریہ!
                </p>
              </div>
              <div className="pt-4 text-xs text-gray-400">
                Have questions? Contact support at <a href={`mailto:${branding.email}`} className="underline" style={{ color: branding.primaryColor }}>{branding.email}</a>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
