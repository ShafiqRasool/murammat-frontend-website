import React from 'react';
import { ShieldCheck, Clock, Wrench, ThumbsUp } from 'lucide-react';

export default function WhyMurammat() {
  const features = [
    {
      icon: <ShieldCheck size={40} className="text-[#00674F]" />,
      title: 'Verified Professionals',
      description: 'Every service provider goes through a rigorous background check and skill verification process to ensure top-notch quality and safety.'
    },
    {
      icon: <Clock size={40} className="text-[#00674F]" />,
      title: 'On-Time Service',
      description: 'We respect your time. Our professionals are committed to arriving at the scheduled time and completing the job efficiently.'
    },
    {
      icon: <Wrench size={40} className="text-[#00674F]" />,
      title: 'Expert Craftsmanship',
      description: 'From minor repairs to major installations, our experts have the right tools and knowledge to get the job done perfectly.'
    },
    {
      icon: <ThumbsUp size={40} className="text-[#00674F]" />,
      title: 'Satisfaction Guaranteed',
      description: 'Your satisfaction is our priority. If you are not happy with the service, we will work to make it right.'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Why Choose <span className="text-[#00674F]">Murammat</span>?
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are revolutionizing home maintenance by bringing trust, quality, and convenience right to your doorstep. Experience the difference with our premium services.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 bg-[#00674F]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md border border-gray-100 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              At Murammat, we believe that finding a reliable handyman shouldn't be a hassle. Our platform was built with a simple goal: to connect homeowners with skilled, trustworthy professionals in their local area.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We handle the vetting, pricing, and scheduling so you can focus on what matters most. Whether it's a leaky faucet or a full room renovation, Murammat is your partner in maintaining a beautiful and functional home.
            </p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            {/* Using a placeholder or an abstract composition */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-xl">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#00674F]/20 to-transparent"></div>
               <ShieldCheck size={120} className="text-[#00674F]/40" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
