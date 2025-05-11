
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Image } from 'lucide-react';
import { getGalleryImages } from '@/services/mockData';
import { GalleryImage } from '@/types';

const GalleryManagement = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  
  // Form states
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState('');
  
  const categories = ["Interior", "Food", "Kitchen", "Culture", "Exterior", "Events"];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const data = await getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load gallery images"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    // In a real application, this would call an API endpoint
    if (!imageUrl || !altText || !category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required"
      });
      return;
    }
    
    const newImage: GalleryImage = {
      id: `g${Date.now()}`,
      url: imageUrl,
      alt: altText,
      category: category
    };
    
    setImages([...images, newImage]);
    
    toast({
      title: "Image Added",
      description: "Gallery image has been added successfully"
    });
    
    // Reset form
    setImageUrl('');
    setAltText('');
    setCategory('');
    setIsAddDialogOpen(false);
  };

  const handleEditImage = () => {
    if (!editImage || !imageUrl || !altText || !category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required"
      });
      return;
    }
    
    const updatedImage: GalleryImage = {
      ...editImage,
      url: imageUrl,
      alt: altText,
      category: category
    };
    
    setImages(images.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    ));
    
    toast({
      title: "Image Updated",
      description: "Gallery image has been updated successfully"
    });
    
    setIsEditDialogOpen(false);
  };

  const handleDeleteImage = (id: string) => {
    // In a real application, this would call an API endpoint
    setImages(images.filter(img => img.id !== id));
    
    toast({
      title: "Image Deleted",
      description: "Gallery image has been removed"
    });
  };

  const openEditDialog = (image: GalleryImage) => {
    setEditImage(image);
    setImageUrl(image.url);
    setAltText(image.alt);
    setCategory(image.category);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setImageUrl('');
    setAltText('');
    setCategory('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-restaurant-dark-green">Gallery Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Image
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading gallery images...</div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 bg-restaurant-cream/70 rounded-lg backdrop-blur-sm shadow-sm">
          <p className="text-lg text-gray-600">No gallery images found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 overflow-hidden group">
                <img 
                  src={image.url} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white text-gray-800 hover:bg-gray-100"
                      onClick={() => openEditDialog(image)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-white text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium truncate">{image.alt}</p>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1">
                  {image.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Image Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="altText">Alt Text / Description</Label>
                <Input
                  id="altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Describe the image"
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
              
              {imageUrl && (
                <div className="border rounded-md overflow-hidden h-48">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddImage}>Add Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-altText">Alt Text / Description</Label>
                <Input
                  id="edit-altText"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
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
              
              {imageUrl && (
                <div className="border rounded-md overflow-hidden h-48">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditImage}>Update Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;
