import React from 'react';
import { ShieldCheck, Cpu, HardHat, Banknote, Clock, Award, FileBadge } from 'lucide-react';

const features = [
  { id: 1, text: 'Vetted and background-checked in-house staff', icon: <ShieldCheck size={24} /> },
  { id: 2, text: 'High-Tech and Most Advanced Equipment', icon: <Cpu size={24} /> },
  { id: 3, text: 'Quality Control and Safety', icon: <HardHat size={24} /> },
  { id: 4, text: 'Affordable and Upfront Pricing', icon: <Banknote size={24} /> },
  { id: 5, text: 'Timely and Convenient Services', icon: <Clock size={24} /> },
  { id: 6, text: 'Experienced, Trained and Certified', icon: <Award size={24} /> },
  { id: 7, text: 'Post Service Guarantee', icon: <FileBadge size={24} /> },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 antialiased overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: Image with Decorative Dots */}
          <div className="w-full lg:w-1/2 relative flex justify-center">
            
            {/* Top Left Decorative Dots */}
            <div className="absolute -top-6 -left-6 w-32 h-32 text-[#878787]/30 z-0 hidden sm:block">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots-top" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#dots-top)" />
              </svg>
            </div>

            {/* Bottom Right Decorative Dots */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 text-[#00674F]/30 z-0 hidden sm:block">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="dots-bottom" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                </pattern>
                <rect width="100" height="100" fill="url(#dots-bottom)" />
              </svg>
            </div>

            {/* Main Image */}
            <div className="relative z-10 w-full max-w-[450px] aspect-square shadow-2xl rounded-sm overflow-hidden border-4 border-white">
              {/* Replace the src with your actual image path */}
              <img 
                src="/assets/LandingPage/why-choose-us.jpg" 
                alt="Murammat Professional Tools" 
                className="w-full h-full object-cover"
                // Fallback placeholder if image isn't loaded yet
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Text and List */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Why Choose Murammat.pk?
            </h2>
            <p className="text-base text-gray-600 mb-8 leading-relaxed">
              Murammat.pk is a value addition which covers all 360 home services under one platform. Our motive is to provide the best services to our residential, commercial, and corporate customers in Lahore. Our main key components to success are:
            </p>

            {/* Features List */}
            <ul className="space-y-4">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-center group cursor-default">
                  {/* Icon Container - Emerald Green Theme */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#00674F]/20 text-[#00674F] mr-4 shadow-sm transition-all duration-300 group-hover:bg-[#00674F] group-hover:text-white">
                    {feature.icon}
                  </div>
                  {/* Text */}
                  <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-[#00674F] transition-colors duration-300">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;