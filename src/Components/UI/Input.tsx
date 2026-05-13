import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1 mb-4 animate-fade-in">
      <label className="text-sm font-semibold text-[#878787]">
        {label}
      </label>
      <input
        className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-300
          ${error 
            ? 'border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-[#00674F] focus:ring-[#00674F]/20'
          } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
