import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import mobileAppImg from '../../assets/LandingPage/murammat-mobile-web.png';

const AppDownload: React.FC = () => {
  // State to trigger the animation after 4 seconds
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 1000); // Trigger sooner for better UX

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full bg-gradient-to-br from-[#00674F] via-[#005c46] to-[#004232] py-16 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
        
        {/* LEFT COLUMN: Text & Actions */}
        <div className="w-full lg:w-1/2 text-white flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Enhanced Typography */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1] drop-shadow-sm">
            Book home services <br />
            <span className="text-[#A7D1C6]">on the go.</span>
          </h2>
          
          <p className="text-base md:text-lg text-[#E0EFEA] mb-8 leading-relaxed max-w-lg font-medium opacity-90">
            Access the Murammat.pk platform directly from your phone. Track bookings in real-time, get exclusive discounts, and connect with our verified experts.
          </p>

          {/* Clean Features List */}
          <div className="flex justify-center lg:justify-start gap-6 mb-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#A7D1C6]" />
              <span className="text-sm md:text-base font-semibold tracking-wide">Faster Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-[#A7D1C6]" />
              <span className="text-sm md:text-base font-semibold tracking-wide">Live Tracking</span>
            </div>
          </div>

          {/* Clean Actions: QR Code & Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
            
            {/* Real QR Code Box */}
            <div className={`bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center min-w-[120px] transition-all duration-700 ease-in-out ${isAnimated ? 'shadow-white/20 -translate-y-1' : ''}`}>
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://murammat.pk" 
                alt="Murammat QR Code" 
                className="w-[80px] h-[80px] mix-blend-multiply"
              />
              <span className="text-[10px] font-extrabold text-gray-800 mt-3 tracking-[0.2em] uppercase text-center leading-tight">
                Scan to<br/>Download
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-24 bg-white/20"></div>

            {/* Official Store Badges */}
            <div className="flex flex-col gap-4 w-full sm:w-auto">
              {/* Apple App Store Badge */}
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="hover:-translate-y-1 hover:scale-105 transition-all duration-300 drop-shadow-md"
              >
                <img 
                  src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" 
                  alt="Download on the App Store" 
                  className="h-[44px] w-auto" 
                />
              </a>

              {/* Google Play Store Badge */}
              <a 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="hover:-translate-y-1 hover:scale-105 transition-all duration-300 drop-shadow-md"
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-[44px] w-auto" 
                />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pure CSS Mobile Phone Mockup */}
        <div className="w-full lg:w-1/2 flex justify-center mt-16 lg:mt-0 perspective-1000">
          
          {/* CSS Phone Frame */}
          <div 
            className={`relative w-[280px] sm:w-[320px] h-[580px] sm:h-[650px] bg-[#111] rounded-[3rem] border-[12px] sm:border-[14px] border-[#222] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-20 transition-all duration-1000 ease-in-out transform ${isAnimated ? '-translate-y-6 rotate-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]' : 'translate-y-12 opacity-0'}`}
          >
            {/* Phone Hardware accents */}
            <div className="absolute top-1/4 -right-3 sm:-right-4 w-1 sm:w-1.5 h-16 bg-[#333] rounded-l-md"></div>
            <div className="absolute top-20 -left-3 sm:-left-4 w-1 sm:w-1.5 h-10 bg-[#333] rounded-r-md"></div>
            <div className="absolute top-36 -left-3 sm:-left-4 w-1 sm:w-1.5 h-16 bg-[#333] rounded-r-md"></div>

            {/* Dynamic Phone Notch / Dynamic Island */}
            <div className="absolute top-2 inset-x-0 h-6 sm:h-7 bg-[#111] rounded-3xl w-[35%] mx-auto z-30 shadow-[0_2px_10px_rgba(0,0,0,0.5)]"></div>
            
            {/* App Screen Container */}
            <div className="w-full h-full bg-white relative rounded-[2rem] overflow-hidden">
              <img 
                src={mobileAppImg} 
                alt="Murammat App Interface" 
                className="w-full h-full object-cover object-top"
              />
              
              {/* Overlay gradient to simulate screen depth and reflections */}
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AppDownload;