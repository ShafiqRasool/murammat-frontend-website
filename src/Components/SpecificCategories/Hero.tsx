import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft } from 'lucide-react';
import API from '../../utils/api';

// Import your actual images from your assets folder here
import slide1 from '../../assets/LandingPage/cleaning-services.jpg';
import slide2 from '../../assets/LandingPage/appliance-repair.jpg';
import slide3 from '../../assets/LandingPage/plumbing-services.jpg';

interface CategoryHeroProps {
  heading?: string;
  subheading?: string;
  images?: string[];
  parentId?: string | null;
}

const Hero: React.FC<CategoryHeroProps> = ({ 
  heading = "Home Maintenance", // Default fallback if no category is clicked
  subheading = "Connecting customers and technicians for quick, safe, and affordable bookings.",
  images = [slide1, slide2, slide3],
  parentId = null
}) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sliderImages, setSliderImages] = useState<string[]>(images);

  // Auto-sliding effect every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // Load custom categories images from backend dynamically
  useEffect(() => {
    const fetchCategoryImages = async () => {
      if (!parentId) return;
      try {
        const response = await API.get('/public/parent-categories');
        const currentParent = response.data.find((p: any) => p.id === parentId);
        if (currentParent && currentParent.image_urls && currentParent.image_urls.length > 0) {
          const urls = currentParent.image_urls.map((url: string) => {
            if (url.startsWith('http')) return url;
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const baseUrl = apiUrl.replace('/api', '');
            return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
          });
          setSliderImages(urls);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error('Failed to fetch parent category images for slider:', error);
      }
    };
    fetchCategoryImages();
  }, [parentId]);

  return (
    <section className="relative w-full min-h-[500px] bg-[#FAFAFA] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Left Content Area */}
      <div className="w-full md:w-1/2 px-6 md:px-16 py-16 flex flex-col justify-center z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 hover:bg-black/10 border border-black/10 text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-sm group hover:-translate-y-0.5 w-fit cursor-pointer font-sans"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
        </button>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
          {heading} <br/>
          <span className="text-[#00674F]">Made Easy!!</span>
        </h1>
        <p className="text-[#878787] text-lg mb-8 max-w-md">
          {subheading}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mb-8">
          <button className="bg-[#00674F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#004f3d] transition-all duration-300 shadow-lg shadow-emerald-900/20 transform hover:-translate-y-1">
            Book Now
          </button>
          
          {/* Direct call button for the Pakistani market */}
          <a 
            href="tel:03274540905" 
            className="bg-white p-3 rounded-lg text-[#00674F] shadow-md hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
            aria-label="Call Us"
          >
            <Phone size={24} fill="currentColor" className="text-[#00674F]" />
          </a>
        </div>
        
      </div>

      {/* Right Image Slider Area */}
      <div className="w-full md:w-1/2 relative h-[400px] md:h-auto">
        
        {/* The Sweeping Curve Mask (Recreating the shape from your screenshot) */}
        <div 
          className="hidden md:block absolute top-0 left-0 w-32 h-full bg-[#FAFAFA] z-10" 
          style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }}
        ></div>

        {/* Dynamic Image Slider */}
        {sliderImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={img} 
              alt={`Service representation ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            {/* Subtle dark gradient overlay to make images look premium */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
          </div>
        ))}

        {/* Slider Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 md:left-[60%] transform -translate-x-1/2 flex space-x-3 z-20">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-[#00674F] w-8' // Active dot expands to a pill shape
                  : 'bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;