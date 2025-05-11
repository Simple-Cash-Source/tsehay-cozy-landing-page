
import React from 'react';
import { MenuItem } from '../types';

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  return (
    <div className="menu-card group">
      <div className="overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="menu-image"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-playfair text-xl font-semibold text-restaurant-earth">{item.name}</h3>
          <span className="text-restaurant-brown font-semibold">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
        <div className="pt-2 border-t border-gray-200">
          <span className="inline-block bg-restaurant-cream text-restaurant-earth text-xs px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
