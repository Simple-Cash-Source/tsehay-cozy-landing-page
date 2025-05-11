
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from 'lucide-react';
import { updateTableAvailability } from '@/services/mockData';
import { TableAvailability } from '@/types';

// Mock function to get all tables
const getAllTables = async (): Promise<TableAvailability[]> => {
  // In a real app, this would be an API call
  return [
    { id: "t1", tableNumber: 1, capacity: 2, isAvailable: true },
    { id: "t2", tableNumber: 2, capacity: 4, isAvailable: true },
    { id: "t3", tableNumber: 3, capacity: 6, isAvailable: false },
    { id: "t4", tableNumber: 4, capacity: 4, isAvailable: true },
    { id: "t5", tableNumber: 5, capacity: 8, isAvailable: true },
    { id: "t6", tableNumber: 6, capacity: 2, isAvailable: false },
  ];
};

const TableManagement = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState('');

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setIsLoading(true);
    try {
      const data = await getAllTables();
      setTables(data);
    } catch (error) {
      console.error('Failed to load tables:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tables"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (tableId: string, currentAvailability: boolean) => {
    try {
      await updateTableAvailability(tableId, !currentAvailability);
      
      setTables(tables.map(table => 
        table.id === tableId 
          ? { ...table, isAvailable: !currentAvailability } 
          : table
      ));
      
      toast({
        title: "Table Updated",
        description: `Table #${tables.find(t => t.id === tableId)?.tableNumber} is now ${!currentAvailability ? 'available' : 'unavailable'}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update table availability"
      });
    }
  };

  const handleAddTable = () => {
    // In a real application, this would call an API endpoint
    const newTable: TableAvailability = {
      id: `t${Date.now()}`,
      tableNumber: parseInt(tableNumber),
      capacity: parseInt(capacity),
      isAvailable: true
    };
    
    setTables([...tables, newTable]);
    toast({
      title: "Table Added",
      description: `Table #${tableNumber} has been added successfully`
    });
    
    setTableNumber('');
    setCapacity('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-restaurant-dark-green">Table Management</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Table
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className="text-center py-8 bg-restaurant-cream/70 rounded-lg backdrop-blur-sm shadow-sm">
          <p className="text-lg text-gray-600">No tables found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {tables.map((table) => (
            <div 
              key={table.id} 
              className={`p-4 rounded-lg shadow-md ${
                table.isAvailable ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Table #{table.tableNumber}</h3>
                  <p className="text-gray-600">Capacity: {table.capacity} people</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {table.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <Switch 
                    checked={table.isAvailable}
                    onCheckedChange={() => handleToggleAvailability(table.id, table.isAvailable)}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-1"
                // In a real app, this would open an edit dialog
                onClick={() => toast({
                  title: "Feature Coming Soon",
                  description: "Table editing will be available in the next update"
                })}
              >
                <Edit className="h-4 w-4" />
                Edit Details
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Seating Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="Enter number of seats"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddTable}
              disabled={!tableNumber || !capacity}
            >
              Add Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableManagement;
