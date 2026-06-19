import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import API from '../utils/api';
import toast from 'react-hot-toast';

// Social SVG Icons
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TiktokIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2a3 3 0 0 0 3 3v2a5 5 0 0 1-5-5h-2v11a3 3 0 1 1-3-3v-2a5 5 0 1 0 5 5V2z" />
  </svg>
);

const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const PinterestIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.218-.173.263-.4.157-1.498-.697-2.434-2.885-2.434-4.637 0-3.778 2.748-7.247 7.915-7.247 4.15 0 7.378 2.96 7.378 6.907 0 4.126-2.6 7.447-6.212 7.447-1.213 0-2.355-.631-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 11.993-5.366 11.993-11.985C24.014 5.367 18.643 0 12.017 0z"/>
  </svg>
);

const WhatsappIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.362 2.76.105 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setPhoneError('');
      if (value !== '' && !/^\d+$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 11) {
      setPhoneError('Phone number must be exactly 11 digits (e.g., 03274540905).');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post('/public/complaints', formData);
      toast.success('Your message/complaint has been submitted successfully!');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit message. Please try again later.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] text-white flex flex-col antialiased relative overflow-hidden">
      <style>{`
        @keyframes float-blob-contact {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-25px, 25px) scale(1.06); }
        }
        @keyframes float-blob-contact-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          50% { transform: translate(30px, -20px) scale(0.95); }
        }
        @keyframes text-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float-contact {
          animation: float-blob-contact 12s ease-in-out infinite;
        }
        .animate-float-contact-2 {
          animation: float-blob-contact-2 15s ease-in-out infinite;
        }
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: text-shimmer 6s linear infinite;
        }
      `}</style>

      {/* Drifting gradient blur background elements */}
      <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] bg-[#009b77]/10 rounded-full blur-3xl pointer-events-none z-0 animate-float-contact"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none z-0 animate-float-contact-2"></div>
      <div className="absolute top-[40%] right-[25%] w-[320px] h-[320px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-float-contact"></div>

      {/* Abstract Glowing Fluid Wave Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.14]">
        <svg className="w-full h-full min-h-[900px]" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M-100 400 C 300 200, 700 600, 1100 300 C 1300 150, 1500 230, 1600 250" stroke="url(#contact-wave-gradient)" strokeWidth="3" strokeLinecap="round" />
          <path d="M-50 470 C 350 300, 650 670, 1050 370 C 1250 230, 1450 300, 1550 320" stroke="url(#contact-wave-gradient)" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="contact-wave-gradient" x1="0" y1="0" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00ffc4" />
              <stop offset="0.5" stopColor="#00674F" />
              <stop offset="1" stopColor="rgba(234, 179, 8, 0.6)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
        <span className="inline-flex items-center gap-2 bg-[#00674F]/40 text-[#00ffc4] border border-[#009b77]/30 font-extrabold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffc4] animate-pulse"></span>
          Contact Support
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Get in Touch with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc4] via-[#009b77] to-yellow-300 animate-text-shimmer">
            Murammat.pk
          </span>
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
          Have questions, service inquiries, or complaints? Our dedicated team is here to assist you. Fill out the form or reach us through any of our channels below.
        </p>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
        
        {/* Left Side: Contact Information & Cards */}
        <div className="lg:col-span-5 space-y-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00ffc4] uppercase tracking-wider mb-2">
              <span className="w-6 h-0.5 bg-[#00ffc4]"></span>
              Direct Helpline
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">Contact Information</h2>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              We respond to inquiries as quickly as possible. Reach out directly or visit us at our offices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Phone Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.2)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:border-[#00ffc4]/30 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="p-3 bg-[#00ffc4]/10 rounded-xl text-[#00ffc4] group-hover:bg-[#00ffc4] group-hover:text-[#012218] transition-all duration-300 shadow-sm">
                <Phone size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#00ffc4] uppercase tracking-wider">Phone Helpline</p>
                <a href="tel:03274540905" className="text-base font-extrabold text-white hover:text-[#00ffc4] hover:underline transition-colors block">
                  0327-454-0905
                </a>
                <p className="text-xs text-emerald-100/50">Call us for immediate support</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.2)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:border-[#00ffc4]/30 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="p-3 bg-[#00ffc4]/10 rounded-xl text-[#00ffc4] group-hover:bg-[#00ffc4] group-hover:text-[#012218] transition-all duration-300 shadow-sm">
                <Mail size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#00ffc4] uppercase tracking-wider">Email Address</p>
                <a href="mailto:support@murammat.pk" className="text-base font-extrabold text-white hover:text-[#00ffc4] hover:underline transition-colors block">
                  support@murammat.pk
                </a>
                <p className="text-xs text-emerald-100/50">We respond to email within 24 hours</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.2)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(34,197,94,0.05)] hover:border-green-400/30 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-[#012218] transition-all duration-300 shadow-sm">
                <WhatsappIcon size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider">WhatsApp Chat</p>
                <a href="https://wa.me/923274540905" target="_blank" rel="noopener noreferrer" className="text-base font-extrabold text-white hover:text-green-400 hover:underline transition-colors block">
                  +92 327 4540905
                </a>
                <p className="text-xs text-emerald-100/50">Chat with support representatives online</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.2)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:border-[#00ffc4]/30 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="p-3 bg-[#00ffc4]/10 rounded-xl text-[#00ffc4] group-hover:bg-[#00ffc4] group-hover:text-[#012218] transition-all duration-300 shadow-sm">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#00ffc4] uppercase tracking-wider">Office Address</p>
                <p className="text-base font-extrabold text-white leading-relaxed">
                  Lahore, Punjab, Pakistan
                </p>
                <p className="text-xs text-emerald-100/50">Serving residential & commercial clients</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.2)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgba(0,255,196,0.05)] hover:border-[#00ffc4]/30 hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="p-3 bg-[#00ffc4]/10 rounded-xl text-[#00ffc4] group-hover:bg-[#00ffc4] group-hover:text-[#012218] transition-all duration-300 shadow-sm">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#00ffc4] uppercase tracking-wider">Working Hours</p>
                <p className="text-base font-extrabold text-white">
                  Monday - Sunday: 9:00 AM - 9:00 PM
                </p>
                <p className="text-xs text-emerald-100/50">Helpline open daily for emergencies</p>
              </div>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Follow Our Updates</h3>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61570663409989" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1877f2] hover:border-transparent transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                <FacebookIcon size={18} />
              </a>
              <a href="https://www.instagram.com/murammat_pk" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#c13584] hover:border-transparent transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                <InstagramIcon size={18} />
              </a>
              <a href="https://www.tiktok.com/@murammat.pk" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#000000] hover:border-transparent transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                <TiktokIcon size={18} />
              </a>
              <a href="https://www.youtube.com/@Murammat-admin" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#ff0000] hover:border-transparent transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                <YoutubeIcon size={18} />
              </a>
              <a href="https://pin.it/7f3sbiIwW" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#bd081c] hover:border-transparent transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                <PinterestIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form Container */}
        <div className="lg:col-span-7 bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between z-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00ffc4] via-[#009b77] to-yellow-300"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00674F]/20 rounded-full flex items-center justify-center text-[#00ffc4] shadow-inner">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Send Us a Message</h3>
                <p className="text-xs text-emerald-100/50">Provide details of your query or feedback below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Full Name *</label>
                  <input
                    id="name"
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Phone Number *</label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03XXXXXXXXX (11 digits)"
                    maxLength={11}
                    className={`w-full px-4 py-3.5 text-sm rounded-lg border bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 transition-all ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-[#00ffc4] focus:border-transparent'}`}
                  />
                  {phoneError && <p className="text-red-400 text-[11px] font-semibold mt-1">{phoneError}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Email Address *</label>
                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wide">Message / Query Details *</label>
                <textarea
                  id="message"
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what you need help with..."
                  rows={5}
                  className="w-full px-4 py-3.5 text-sm rounded-lg border border-white/10 bg-white/5 text-white placeholder-emerald-100/30 focus:outline-none focus:ring-2 focus:ring-[#00ffc4] focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#00674F] to-[#009b77] hover:from-[#00523f] hover:to-[#00aa82] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#009b77]/20 hover:shadow-xl hover:shadow-[#009b77]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span>Submitting message...</span>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By submitting this form, you agree that our team can contact you via call or email matching the details provided.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Contact;
