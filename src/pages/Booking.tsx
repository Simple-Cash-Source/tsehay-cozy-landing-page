
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import BookingForm from '../components/BookingForm';

const Booking = () => {
  return (
    <>
      <Navbar />
      
      <PageHeader 
        title="Book a Table" 
        subtitle="Reserve your table for an authentic Ethiopian dining experience"
        backgroundImage="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80"
      />
      
      <div className="section-padding py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold font-playfair text-restaurant-dark-green mb-6">
              Reservation Details
            </h2>
            
            <BookingForm />
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-restaurant-earth mb-2">Reservation Policies</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Reservations are held for 15 minutes past the scheduled time.</li>
                <li>For parties of 8 or more, please call us directly.</li>
                <li>Cancellations should be made at least 4 hours in advance.</li>
                <li>Special requests are subject to availability.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <section className="bg-restaurant-cream py-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-restaurant-cream/70 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h2 className="text-3xl font-bold font-playfair text-restaurant-dark-green mb-6">
                Private Events & Catering
              </h2>
              <p className="text-gray-700 mb-6">
                Looking to host a private event or need catering services? Tsehay Kitfo offers customized menus and services for special occasions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-restaurant-earth mb-3">Private Dining</h3>
                <p className="text-gray-700 mb-4">
                  Our private dining area can accommodate groups of up to 20 people, perfect for celebrations, business meetings, or family gatherings.
                </p>
                <a href="/contact" className="text-restaurant-earth font-medium hover:text-restaurant-brown">
                  Inquire about private dining
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-restaurant-earth mb-3">Catering Services</h3>
                <p className="text-gray-700 mb-4">
                  Bring the flavors of Ethiopia to your event. We offer full-service catering for events of all sizes, from intimate gatherings to large celebrations.
                </p>
                <a href="/contact" className="text-restaurant-earth font-medium hover:text-restaurant-brown">
                  Learn about our catering
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Booking;
