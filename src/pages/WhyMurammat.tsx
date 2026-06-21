import React from 'react';
import { ShieldCheck, Clock, Wrench, ThumbsUp, Star, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhyMurammat() {
  const features = [
    {
      icon: <ShieldCheck size={36} className="text-[#00674F] group-hover:text-white transition-colors duration-300" />,
      title: 'Verified Professionals',
      description: 'Every technician undergoes rigorous background screening and practical skill verification to guarantee top-notch quality and security.'
    },
    {
      icon: <Clock size={36} className="text-[#00674F] group-hover:text-white transition-colors duration-300" />,
      title: 'On-Time Service',
      description: 'We respect your schedule. Our experts arrive on time, equipped with advanced tools to complete your job quickly and efficiently.'
    },
    {
      icon: <Wrench size={36} className="text-[#00674F] group-hover:text-white transition-colors duration-300" />,
      title: 'Expert Craftsmanship',
      description: 'From simple fixture repairs to complex corporate maintenance, we deliver precise results using cutting-edge equipment.'
    },
    {
      icon: <ThumbsUp size={36} className="text-[#00674F] group-hover:text-white transition-colors duration-300" />,
      title: 'Post-Service Guarantee',
      description: 'Your satisfaction is our absolute priority. We stand by our work and offer a post-service guarantee to keep you worry-free.'
    }
  ];

  const values = [
    { title: 'Customer First', desc: 'Every decision we make is centered on adding value and ease to our customers\' lives.' },
    { title: 'Skill Empowerment', desc: 'We train and hire in-house staff, contributing directly to reducing unemployment in Pakistan.' },
    { title: 'Transparent Pricing', desc: 'Upfront estimates and clear rates ensure there are never any hidden costs or surprises.' },
    { title: 'Quality Assurance', desc: 'Regular feedback monitoring guarantees that service standards remain consistently high.' }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 antialiased">
      {/* Header Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#012218] via-[#003B2D] to-[#012218] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
        {/* Glow elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#009b77]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-5">
          <span className="inline-flex items-center gap-2 bg-[#00674F]/40 text-[#00ffc4] border border-[#009b77]/30 font-extrabold text-[10px] px-4 py-1.5 rounded-full uppercase tracking-wider">
            Discover the Difference
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffc4] via-[#009b77] to-yellow-300">Murammat.pk</span>?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
            We are revolutionizing home maintenance across Lahore by combining certified talent, upfront pricing, and absolute convenience under a single trusted platform.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Key Features Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-[#00674F]/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00674F] group-hover:scale-105 transition-all duration-300 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#00674F] transition-colors">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Our Mission & Values Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Story Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00674F] uppercase tracking-wider">
              <span className="w-6 h-0.5 bg-[#00674F]"></span>
              Our Story & Focus
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Empowering Homes, Training Communities
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              At Murammat, we believe home maintenance should be a source of comfort, not stress. We launched with a clear, dual-sided motive: to provide residential and commercial spaces in Lahore with vetted in-house experts, while simultaneously reducing unemployment by onboarding and training skilled local technicians.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              We handle the coordination, scheduling, and service guarantees so you can enjoy your space. From swift emergency plumbing to custom appliance repair, we are committed to craftsmanship and customer care.
            </p>
            
            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-[#00674F] hover:bg-[#00523f] text-white text-xs font-bold px-5 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>Book a Service</span>
                <ChevronRight size={14} />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-5 py-3 rounded-lg border border-gray-200 shadow-sm transition-all"
              >
                Contact Team
              </Link>
            </div>
          </div>

          {/* Graphic Right */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[400px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-tr from-[#012218] to-[#004D3B] flex flex-col items-center justify-center p-8 text-center border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-[#00ffc4]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-lg">
                <ShieldCheck size={50} className="text-[#00ffc4]" />
              </div>
              
              <h4 className="text-xl font-bold text-white mb-2">Our Quality Seal</h4>
              <p className="text-xs text-emerald-100/60 leading-relaxed max-w-[280px]">
                Every service booked through Murammat.pk is covered by our post-service guarantee to ensure peace of mind.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-20 space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Our Core Promises</h2>
            <div className="w-12 h-1 bg-[#00674F] mx-auto rounded-full"></div>
            <p className="text-xs text-gray-500 max-w-lg mx-auto">
              How we hold ourselves accountable to deliver the best possible standards day in and day out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#FAFAFA] border border-gray-100/80 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#00674F]" />
                  <h4 className="text-sm font-bold text-gray-900">{v.title}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-6">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Box */}
        <section className="bg-gradient-to-r from-[#012218] via-[#004D3B] to-[#012218] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl text-center border border-white/5 space-y-6">
          <div className="absolute inset-0 bg-[#00ffc4]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Ready to experience premium maintenance?</h3>
          <p className="text-sm text-emerald-100/70 max-w-xl mx-auto leading-relaxed">
            Get matched with verified in-house experts in Lahore. Instant booking, upfront pricing, and absolute safety are just a call away.
          </p>
          
          <div className="flex justify-center pt-2">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-[#00ffc4] hover:bg-[#00e2af] text-[#012218] text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#00ffc4]/20 hover:shadow-xl hover:shadow-[#00ffc4]/30 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore Main Categories</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
