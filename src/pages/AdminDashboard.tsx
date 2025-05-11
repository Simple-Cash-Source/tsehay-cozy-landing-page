
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BookingManagement from '@/components/admin/BookingManagement';
import MenuManagement from '@/components/admin/MenuManagement';
import TableManagement from '@/components/admin/TableManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-restaurant-dark-green text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tsehay Kitfo Admin Dashboard</h1>
          <button
            onClick={logout}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="bookings">Reservations</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="tables">Table Management</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="p-6 bg-white rounded-lg shadow">
            <BookingManagement />
          </TabsContent>
          
          <TabsContent value="menu" className="p-6 bg-white rounded-lg shadow">
            <MenuManagement />
          </TabsContent>
          
          <TabsContent value="tables" className="p-6 bg-white rounded-lg shadow">
            <TableManagement />
          </TabsContent>
          
          <TabsContent value="gallery" className="p-6 bg-white rounded-lg shadow">
            <GalleryManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
