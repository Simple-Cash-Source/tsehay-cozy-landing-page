
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Save, X, Home, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getMenuItems, 
  getAvailableTables, 
  updateTableAvailability, 
  updateMenuItem,
  addMenuItem
} from '../services/mockData';
import { MenuItem, TableAvailability } from '../types';

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableAvailability[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<MenuItem | null>(null);
  const [isAddingMenuItem, setIsAddingMenuItem] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: ''
  });

  useEffect(() => {
    // Fetch menu items
    getMenuItems()
      .then(items => setMenuItems(items))
      .catch(error => console.error('Failed to fetch menu items:', error));
    
    // Fetch tables
    getAvailableTables(new Date().toISOString())
      .then(tablesData => setTables(tablesData))
      .catch(error => console.error('Failed to fetch tables:', error));
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const handleToggleTableAvailability = async (tableId: string, isAvailable: boolean) => {
    try {
      await updateTableAvailability(tableId, !isAvailable);
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId 
            ? { ...table, isAvailable: !isAvailable } 
            : table
        )
      );
      toast({
        title: "Table Updated",
        description: `Table ${tables.find(t => t.id === tableId)?.tableNumber} is now ${!isAvailable ? 'available' : 'unavailable'}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update table availability",
      });
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditedItem(null);
  };

  const handleSaveMenuItem = async () => {
    if (!editedItem) return;
    
    try {
      await updateMenuItem(editedItem);
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === editedItem.id ? editedItem : item
        )
      );
      setEditingItemId(null);
      setEditedItem(null);
      toast({
        title: "Menu Item Updated",
        description: `${editedItem.name} has been successfully updated`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update menu item",
      });
    }
  };

  const handleAddMenuItem = async () => {
    try {
      const addedItem = await addMenuItem(newMenuItem);
      setMenuItems(prevItems => [...prevItems, addedItem]);
      setIsAddingMenuItem(false);
      setNewMenuItem({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: ''
      });
      toast({
        title: "Menu Item Added",
        description: `${addedItem.name} has been successfully added to the menu`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add menu item",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-restaurant-earth text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold font-playfair">Tsehay Kitfo Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center text-white hover:text-restaurant-cream">
              <Home size={18} className="mr-1" />
              <span>View Site</span>
            </a>
            <button 
              onClick={logout}
              className="bg-white text-restaurant-earth px-4 py-1 rounded hover:bg-gray-100"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tables">
          <TabsList className="mb-6">
            <TabsTrigger value="tables">Table Management</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
          </TabsList>
          
          {/* Table Management Tab */}
          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-playfair text-restaurant-earth">Table Availability</CardTitle>
                <CardDescription>
                  Update the availability of tables for reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tables.map(table => (
                    <Card key={table.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Table {table.tableNumber}</CardTitle>
                        <CardDescription>
                          Capacity: {table.capacity} {table.capacity === 1 ? 'person' : 'people'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className={`inline-block px-2 py-1 rounded text-sm ${
                            table.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {table.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                          <Button
                            onClick={() => handleToggleTableAvailability(table.id, table.isAvailable)}
                            variant="outline"
                            size="sm"
                          >
                            Toggle Status
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Menu Management Tab */}
          <TabsContent value="menu">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-playfair text-restaurant-earth">Menu Items</CardTitle>
                  <CardDescription>
                    Manage your restaurant's menu items
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setIsAddingMenuItem(true)}
                  className="bg-restaurant-earth hover:bg-restaurant-brown"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Item
                </Button>
              </CardHeader>
              <CardContent>
                {/* Add New Menu Item Form */}
                {isAddingMenuItem && (
                  <Card className="mb-6 border-2 border-restaurant-gold">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Menu Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-name">Item Name</Label>
                            <Input
                              id="new-name"
                              value={newMenuItem.name}
                              onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                              placeholder="Item name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-category">Category</Label>
                            <Input
                              id="new-category"
                              value={newMenuItem.category}
                              onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                              placeholder="Category"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-description">Description</Label>
                          <Textarea
                            id="new-description"
                            value={newMenuItem.description}
                            onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                            placeholder="Item description"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-price">Price ($)</Label>
                            <Input
                              id="new-price"
                              type="number"
                              min="0"
                              step="0.01"
                              value={newMenuItem.price}
                              onChange={(e) => setNewMenuItem({...newMenuItem, price: parseFloat(e.target.value)})}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-image">Image URL</Label>
                            <Input
                              id="new-image"
                              value={newMenuItem.image}
                              onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-2">
                          <Button variant="outline" onClick={() => setIsAddingMenuItem(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddMenuItem} className="bg-restaurant-earth hover:bg-restaurant-brown">
                            Add Item
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              
                {/* Menu Items List */}
                <div className="space-y-6">
                  {menuItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      {editingItemId === item.id ? (
                        // Edit mode
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`name-${item.id}`}>Item Name</Label>
                              <Input
                                id={`name-${item.id}`}
                                value={editedItem?.name}
                                onChange={(e) => setEditedItem({...editedItem!, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`category-${item.id}`}>Category</Label>
                              <Input
                                id={`category-${item.id}`}
                                value={editedItem?.category}
                                onChange={(e) => setEditedItem({...editedItem!, category: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`description-${item.id}`}>Description</Label>
                            <Textarea
                              id={`description-${item.id}`}
                              value={editedItem?.description}
                              onChange={(e) => setEditedItem({...editedItem!, description: e.target.value})}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`price-${item.id}`}>Price ($)</Label>
                              <Input
                                id={`price-${item.id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={editedItem?.price}
                                onChange={(e) => setEditedItem({...editedItem!, price: parseFloat(e.target.value)})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`image-${item.id}`}>Image URL</Label>
                              <Input
                                id={`image-${item.id}`}
                                value={editedItem?.image}
                                onChange={(e) => setEditedItem({...editedItem!, image: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2 pt-2">
                            <Button variant="outline" onClick={handleCancelEdit}>
                              <X size={16} className="mr-1" /> Cancel
                            </Button>
                            <Button onClick={handleSaveMenuItem} className="bg-restaurant-earth hover:bg-restaurant-brown">
                              <Save size={16} className="mr-1" /> Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:w-3/4 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-playfair text-xl font-semibold text-restaurant-earth">{item.name}</h3>
                                  <span className="inline-block bg-restaurant-cream text-restaurant-earth text-xs px-2 py-1 rounded mt-1">
                                    {item.category}
                                  </span>
                                </div>
                                <span className="text-restaurant-brown font-semibold">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-gray-600 mt-2">{item.description}</p>
                            </div>
                            <div className="mt-4">
                              <Button 
                                variant="outline"
                                size="sm" 
                                onClick={() => handleEditMenuItem(item)}
                              >
                                <Pencil size={16} className="mr-1" /> Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
