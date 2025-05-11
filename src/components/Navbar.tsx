
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { text: 'Home', href: '/' },
    { text: 'Menu', href: '/menu' },
    { text: 'Gallery', href: '/gallery' },
    { text: 'Book a Table', href: '/booking' },
    { text: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-restaurant-earth font-bold text-2xl">Tsehay Kitfo</h1>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${
                    location.pathname === link.href
                      ? 'text-restaurant-earth border-b-2 border-restaurant-earth'
                      : 'text-gray-700 hover:text-restaurant-brown'
                  } font-medium transition-colors duration-200`}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-restaurant-earth hover:text-restaurant-brown p-2"
            >
              {isMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`${
                  location.pathname === link.href
                    ? 'text-restaurant-earth bg-restaurant-cream'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-restaurant-brown'
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
