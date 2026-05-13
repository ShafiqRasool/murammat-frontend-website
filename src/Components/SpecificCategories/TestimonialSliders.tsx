import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

// Dummy data for the comments - easily replaceable with API data later
const testimonials = [
  {
    id: 1,
    name: "Ahmed Ali",
    location: "DHA, Lahore",
    text: "The Murammat team was incredibly professional. They fixed my AC in under an hour and left the place spotless. The booking process was so easy!",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatima Khan",
    location: "Gulberg, Lahore",
    text: "I booked them for a deep clean of my new apartment. The crew was polite, on time, and used great quality products. Highly recommended.",
    rating: 5,
  },
  {
    id: 3,
    name: "Usman Tariq",
    location: "Bahria Town, Lahore",
    text: "Finally, a reliable home service app in Pakistan. The plumber knew exactly what he was doing and the pricing was very transparent upfront.",
    rating: 4,
  },
  {
    id: 5,
    name: "Bilal Qureshi",
    location: "Model Town, Lahore",
    text: "The electrician arrived right on time and fixed the wiring issue in my kitchen safely. Very satisfied with the transparent pricing.",
    rating: 5,
  },
  {
    id: 6,
    name: "Ayesha Mehmood",
    location: "WAPDA Town, Lahore",
    text: "Booked them for a full house deep clean before Eid. The team was thorough, polite, and didn't rush the job. Will definitely book again.",
    rating: 5,
  },
  {
    id: 7,
    name: "Saad Ibrahim",
    location: "Gulshan-e-Ravi, Lahore",
    text: "My geyser was leaking and I needed an urgent fix. The plumber from Murammat was here within 45 minutes. Great emergency service!",
    rating: 4,
  },
  {
    id: 8,
    name: "Nida Asghar",
    location: "Cantonment, Lahore",
    text: "I used their sofa and carpet cleaning service. They managed to remove some really tough stains that I thought were permanent. Highly recommended!",
    rating: 5,
  },
  {
    id: 9,
    name: "Kamran Shah",
    location: "Iqbal Town, Lahore",
    text: "Good service overall. The AC technician was knowledgeable, but they took a bit longer than estimated to finish. Still, the cooling is perfect now.",
    rating: 4,
  },
  {
    id: 10,
    name: "Sana Rafiq",
    location: "Johar Town, Lahore",
    text: "It's so hard to find reliable handymen in Lahore, but this app makes it seamless. The carpenter fixed my broken doors perfectly without any mess.",
    rating: 5,
  },
  {
    id: 11,
    name: "Hamza Tariq",
    location: "DHA Phase 5, Lahore",
    text: "Their solar panel cleaning service is a lifesaver. I noticed an immediate increase in my inverter's efficiency after they washed the panels.",
    rating: 5,
  },
  {
    id: 12,
    name: "Marium Faisal",
    location: "Askari 11, Lahore",
    text: "Very professional team. They came in proper uniform, brought their own tools, and even cleaned up the dust after installing my new ceiling fans.",
    rating: 5,
  },
  {
    id: 13,
    name: "Aliya Nasir",
    location: "Valencia Town, Lahore",
    text: "I love the fact that I don't have to bargain with the Karigar anymore. The rates are fixed and fair. The painter did an excellent job touching up my living room.",
    rating: 4,
  },
  {
    id: 14,
    name: "Farhan Ahmed",
    location: "Bahria Orchard, Lahore",
    text: "Car detailing right at my doorstep! They saved me a trip to the service station on my only day off. Excellent attention to detail inside and out.",
    rating: 5,
  },
  {
    id: 15,
    name: "Zainab Raza",
    location: "Johar Town, Lahore",
    text: "Amazing service! My sofa looks brand new after their deep cleaning service. The staff was very courteous and respectful of my home.",
    rating: 5,
  }
];

const TestimonialSliders: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-slide logic: Changes slide every 5 seconds unless the user hovers over it
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <section className="w-full py-20 bg-[#FAFAFA] font-sans relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#00674F] opacity-[0.03] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00674F] opacity-[0.03] rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            What Our <span className="text-[#00674F]">Customers Say</span>
          </h2>
          <p className="text-[#878787] text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here is what households are saying about Murammat.
          </p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Card Wrapper for Smooth Translation */}
          <div className="overflow-hidden rounded-3xl shadow-xl shadow-emerald-900/5 bg-white">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="w-full flex-shrink-0 p-8 md:p-14 relative"
                >
                  {/* Large Background Quote Icon */}
                  <Quote className="absolute top-8 left-8 w-24 h-24 text-[#00674F] opacity-5 rotate-180" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    
                    {/* Star Rating */}
                    <div className="flex space-x-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={24} 
                          className={i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-xl md:text-2xl text-gray-700 italic mb-8 leading-relaxed font-medium">
                      "{testimonial.text}"
                    </p>

                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#878787] text-sm mt-1">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows (Hidden on very small screens, visible on hover for desktop) */}
          <button 
            onClick={handlePrevious}
            className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#00674F] shadow-lg hover:bg-[#00674F] hover:text-white transition-all duration-300 z-20 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#00674F] shadow-lg hover:bg-[#00674F] hover:text-white transition-all duration-300 z-20 focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>

        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center space-x-3 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                index === currentIndex 
                  ? 'bg-[#00674F] w-10' 
                  : 'bg-gray-300 w-2.5 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialSliders;