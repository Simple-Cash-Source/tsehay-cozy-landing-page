
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from '../services/mockData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import MenuCard from '../components/MenuCard';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['menuItems'],
    queryFn: getMenuItems,
  });
  
  const categories = menuItems 
    ? ['All', ...Array.from(new Set(menuItems.map(item => item.category)))]
    : ['All'];
    
  const filteredMenu = activeCategory === 'All' 
    ? menuItems 
    : menuItems?.filter(item => item.category === activeCategory);

  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Our Menu" 
        subtitle="Discover our authentic Ethiopian dishes prepared with traditional spices and cooking methods"
        backgroundImage="https://images.unsplash.com/photo-1545042746-ec9e5a59b359?w=800&auto=format&fit=crop&q=80"
      />
      
      <div className="section-padding py-16">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === category
                  ? 'bg-restaurant-earth text-white'
                  : 'bg-restaurant-cream text-restaurant-earth hover:bg-restaurant-gold hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-restaurant-earth border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading menu items...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu?.map(item => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
        
        {filteredMenu?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No menu items found in this category.</p>
          </div>
        )}
      </div>
      
      {/* Ethiopian Dining Experience */}
      <section className="bg-restaurant-cream py-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-playfair text-restaurant-dark-green mb-6">
              The Ethiopian Dining Experience
            </h2>
            <p className="text-gray-700 mb-4">
              Ethiopian cuisine is traditionally eaten without cutlery. Instead, food is served on injera, a spongy sourdough flatbread, which is used to scoop up the various dishes.
            </p>
            <p className="text-gray-700 mb-4">
              Sharing food from a common plate signifies the bonds of loyalty and friendship. This communal dining style is at the heart of Ethiopian culture and brings people together.
            </p>
            <p className="text-gray-700">
              Our restaurant honors these traditions while providing a comfortable dining experience for all our guests.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Menu;
