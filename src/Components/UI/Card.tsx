import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  const baseClasses = "bg-white rounded-xl border border-gray-100 shadow-sm animate-slide-up overflow-hidden";
  const hoverClasses = hoverable ? "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
