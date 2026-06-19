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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col antialiased">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#00674F] to-[#004D3B] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
          <span className="bg-white/10 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">Contact Us</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">Get in Touch with Murammat.pk</h1>
          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Have questions, service inquiries, or complaints? Our dedicated team is here to assist you. Fill out the form or reach us through any of our channels below.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Contact Information & Cards */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Contact Information</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We respond to inquiries as quickly as possible. Reach out directly or visit us at our offices.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Phone Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#00674F]/10 rounded-lg text-[#00674F]">
                <Phone size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#00674F] uppercase tracking-wider">Phone Helpline</p>
                <a href="tel:03274540905" className="text-base font-bold text-gray-800 hover:text-[#00674F] hover:underline transition-colors block">
                  0327-454-0905
                </a>
                <p className="text-xs text-gray-500">Call us for immediate support</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#00674F]/10 rounded-lg text-[#00674F]">
                <Mail size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#00674F] uppercase tracking-wider">Email Address</p>
                <a href="mailto:support@murammat.pk" className="text-base font-bold text-gray-800 hover:text-[#00674F] hover:underline transition-colors block">
                  support@murammat.pk
                </a>
                <p className="text-xs text-gray-500">We respond to email within 24 hours</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-50 rounded-lg text-green-600">
                <WhatsappIcon size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">WhatsApp Chat</p>
                <a href="https://wa.me/923274540905" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-gray-800 hover:text-green-600 hover:underline transition-colors block">
                  +92 327 4540905
                </a>
                <p className="text-xs text-gray-500">Chat with support representatives online</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#00674F]/10 rounded-lg text-[#00674F]">
                <MapPin size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#00674F] uppercase tracking-wider">Office Address</p>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                  Lahore, Punjab, Pakistan
                </p>
                <p className="text-xs text-gray-500">Serving residential & commercial clients</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-[#00674F]/10 rounded-lg text-[#00674F]">
                <Clock size={22} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#00674F] uppercase tracking-wider">Working Hours</p>
                <p className="text-sm font-semibold text-gray-800">
                  Monday - Sunday: 9:00 AM - 9:00 PM
                </p>
                <p className="text-xs text-gray-500">Helpline open daily for emergencies</p>
              </div>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-900">Follow Our Updates</h3>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=61570663409989" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#1877f2] hover:border-transparent transition-all duration-300">
                <FacebookIcon size={18} />
              </a>
              <a href="https://www.instagram.com/murammat_pk" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#c13584] hover:border-transparent transition-all duration-300">
                <InstagramIcon size={18} />
              </a>
              <a href="https://www.tiktok.com/@murammat.pk" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-black hover:border-transparent transition-all duration-300">
                <TiktokIcon size={18} />
              </a>
              <a href="https://www.youtube.com/@Murammat-admin" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#ff0000] hover:border-transparent transition-all duration-300">
                <YoutubeIcon size={18} />
              </a>
              <a href="https://pin.it/7f3sbiIwW" target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-white hover:bg-[#bd081c] hover:border-transparent transition-all duration-300">
                <PinterestIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#00674F] to-[#009b77]"></div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00674F]/10 rounded-full flex items-center justify-center text-[#00674F]">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Send Us a Message</h3>
                <p className="text-xs text-gray-500">Provide details of your query or feedback below</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name *</label>
                  <input
                    id="name"
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/30 focus:border-[#00674F] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Phone Number *</label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03XXXXXXXXX (11 digits)"
                    maxLength={11}
                    className={`w-full px-4 py-3 text-sm rounded-lg border bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${phoneError ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:ring-[#00674F]/30 focus:border-[#00674F]'}`}
                  />
                  {phoneError && <p className="text-red-500 text-[11px] font-semibold mt-1">{phoneError}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address *</label>
                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/30 focus:border-[#00674F] transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-gray-700 uppercase tracking-wide">Message / Query Details *</label>
                <textarea
                  id="message"
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us what you need help with..."
                  rows={5}
                  className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00674F]/30 focus:border-[#00674F] transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#00674F] hover:bg-[#00523f] text-white text-sm font-bold rounded-lg shadow-lg shadow-[#00674F]/20 hover:shadow-xl hover:shadow-[#00674F]/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
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

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              By submitting this form, you agree that our team can contact you via call or email matching the details provided.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Contact;
