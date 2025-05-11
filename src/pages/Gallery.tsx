
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGalleryImages } from '../services/mockData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  const { data: images, isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: getGalleryImages,
  });

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Our Gallery" 
        subtitle="Take a visual tour of our restaurant, dishes, and Ethiopian culture"
        backgroundImage="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80"
      />
      
      <div className="section-padding py-16">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-restaurant-earth border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading gallery...</p>
          </div>
        ) : (
          <>
            {images && <GalleryGrid images={images} />}
          </>
        )}
      </div>
      
      <Footer />
    </>
  );
};

export default Gallery;
