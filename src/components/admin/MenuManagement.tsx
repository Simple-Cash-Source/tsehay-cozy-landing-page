
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getMenuItems, updateMenuItem, addMenuItem } from '@/services/mockData';
import { MenuItem } from '@/types';

const MenuManagement = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = ["Signature Dishes", "Main Courses", "Vegetarian", "Beverages", "Desserts"];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to load menu items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load menu items"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      if (!name || !description || !price || !image || !category) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "All fields are required"
        });
        return;
      }

      const newItem = {
        name,
        description,
        price: parseFloat(price),
        image,
        category
      };

      const addedItem = await addMenuItem(newItem);
      setMenuItems([...menuItems, addedItem]);
      
      toast({
        title: "Success",
        description: "Menu item added successfully"
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      setCategory('');
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add menu item"
      });
    }
  };

  const handleEditItem = async () => {
    try {
      if (!editItem || !name || !description || !price || !image || !category) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "All fields are required"
        });
        return;
      }

      const updatedItem = {
        ...editItem,
        name,
        description,
        price: parseFloat(price),
        image,
        category
      };

      await updateMenuItem(updatedItem);
      
      setMenuItems(menuItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      
      toast({
        title: "Success",
        description: "Menu item updated successfully"
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update menu item"
      });
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setEditItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImage(item.image);
    setCategory(item.category);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    setCategory('');
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-restaurant-dark-green">Menu Management</h2>
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading menu items...</div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-8 bg-restaurant-cream/70 rounded-lg backdrop-blur-sm shadow-sm">
          <p className="text-lg text-gray-600">No menu items found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="inline-block bg-restaurant-cream text-restaurant-earth text-xs px-2 py-1 rounded mt-1">
                      {item.category}
                    </span>
                  </div>
                  <p className="font-bold text-restaurant-earth">${item.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(item)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Menu Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the menu item"
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagement;
