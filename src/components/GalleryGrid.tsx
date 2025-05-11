
import React, { useState } from 'react';
import { GalleryImage } from '../types';

interface GalleryGridProps {
  images: GalleryImage[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(images.map(img => img.category)))];
  
  const filteredImages = filter === 'All' 
    ? images 
    : images.filter(img => img.category === filter);

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === category
                ? 'bg-restaurant-earth text-white'
                : 'bg-restaurant-cream text-restaurant-earth hover:bg-restaurant-gold hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map(image => (
          <div 
            key={image.id}
            className="relative overflow-hidden rounded-md shadow-md cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image.url} 
              alt={image.alt} 
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
              <div className="p-4 w-full text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-medium">{image.alt}</p>
                <span className="text-sm opacity-80">{image.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.alt} 
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="text-white mt-4 text-center">
              <h3 className="text-lg font-medium">{selectedImage.alt}</h3>
              <p className="text-gray-300">{selectedImage.category}</p>
            </div>
          </div>
          <button 
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
