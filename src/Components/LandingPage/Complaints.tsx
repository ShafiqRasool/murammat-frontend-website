import React, { useState } from 'react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const Complaints: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !message) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post('/public/complaints', { name, phone, email, message });
      toast.success('Complaint submitted successfully!');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit complaint. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[#FAFAFA] py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side: Title & Subtitle */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
            Resolving your <br /> complaints!
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-sm">
            Leave your complaint here to help us make our services better for you.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50 focus:border-[#00674F] transition-colors"
                  required
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Phone number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50 focus:border-[#00674F] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50 focus:border-[#00674F] transition-colors"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Message *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00674F]/50 focus:border-[#00674F] transition-colors resize-y"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5c85d6] hover:bg-[#4a72c2] text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Complaints;
