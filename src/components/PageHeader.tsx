
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backgroundImage }) => {
  return (
    <div 
      className="relative py-20 md:py-24 lg:py-32 bg-cover bg-center"
      style={{ 
        backgroundImage: backgroundImage 
          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})` 
          : 'linear-gradient(rgba(1, 98, 87, 0.8), rgba(1, 98, 87, 0.9))' // Changed from brown to green
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
