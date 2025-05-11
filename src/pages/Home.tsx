
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenuItems, getGalleryImages } from '../services/mockData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';
import { Link } from 'react-router-dom';
import { ChefHat, Calendar, ArrowRight } from 'lucide-react';

const Home = () => {
  const { data: featuredMenu } = useQuery({
    queryKey: ['featuredMenu'],
    queryFn: async () => {
      const items = await getMenuItems();
      return items.slice(0, 3); // Get first 3 items for featured section
    },
  });

  const { data: galleryImages } = useQuery({
    queryKey: ['galleryPreview'],
    queryFn: async () => {
      const images = await getGalleryImages();
      return images.slice(0, 3); // Get first 3 images for preview
    },
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540914124281-342587941389?w=1200&auto=format&fit=crop&q=60')" }}></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-restaurant-dark-green mb-4 font-playfair animate-fade-in">
            Tsehay Kitfo
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto animate-fade-in">
            Authentic Ethiopian Cuisine in a Warm Family Atmosphere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/menu" className="btn-primary flex items-center justify-center gap-2">
              <ChefHat size={20} />
              <span>View Our Menu</span>
            </Link>
            <Link to="/booking" className="btn-outline flex items-center justify-center gap-2">
              <Calendar size={20} />
              <span>Book a Table</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-restaurant-earth">Our Story</h2>
            <p className="text-gray-700">
              Tsehay Kitfo was founded with a passion for bringing authentic Ethiopian flavors to your table. Our restaurant is named after our signature dish, Kitfo, a traditional Ethiopian delicacy of minced raw beef seasoned with mitmita and niter kibbeh.
            </p>
            <p className="text-gray-700">
              We take pride in preserving the rich culinary traditions of Ethiopia while creating a warm, inviting atmosphere where families can gather and share meals together, just as they would in Ethiopia.
            </p>
            <p className="text-gray-700">
              Every dish is carefully prepared with authentic spices imported directly from Ethiopia, ensuring that each bite transports you to the vibrant flavors of East Africa.
            </p>
            <Link to="/gallery" className="flex items-center text-restaurant-earth font-medium hover:text-restaurant-brown">
              <span>Learn more about us</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden shadow-lg h-48">
                <img 
                  src="https://images.unsplash.com/photo-1591299177061-2151e53fcece?w=800&auto=format&fit=crop&q=80" 
                  alt="Ethiopian spices" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg h-32">
                <img 
                  src="https://images.unsplash.com/photo-1567337710282-00832b415979?w=800&auto=format&fit=crop&q=80" 
                  alt="Traditional Ethiopian coffee ceremony" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1535224206242-487f7090b5bb?w=800&auto=format&fit=crop&q=80" 
                alt="Restaurant ambiance" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="bg-restaurant-cream py-24">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-restaurant-earth mb-4">
              Featured Dishes
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Explore our most popular Ethiopian specialties, prepared with authentic spices and traditional cooking methods.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredMenu?.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/menu" className="btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&auto=format&fit=crop&q=80')" }}></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative section-padding">
          <div className="text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair">
              Reserve Your Table
            </h2>
            <p className="text-lg max-w-2xl mx-auto">
              Experience the flavors of Ethiopia in our cozy family restaurant. Book a table now to avoid disappointment.
            </p>
            <div className="pt-4">
              <Link to="/booking" className="btn-primary">
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Teaser Section */}
      <section className="section-padding py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-restaurant-earth mb-4">
            Our Restaurant
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Step inside our warm and inviting space, designed to bring a taste of Ethiopia to your dining experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {galleryImages?.map(image => (
            <div key={image.id} className="relative overflow-hidden rounded-lg shadow-md group h-64">
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                <div className="p-4 w-full text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/gallery" className="btn-outline flex items-center justify-center gap-2 mx-auto w-fit">
            <span>View Full Gallery</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Home;
