
import React, { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../../services/mockData';
import { Booking } from '../../types';

const BookingManagement = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Load all bookings
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bookings"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter bookings by date
  const filteredBookings = filterDate 
    ? bookings.filter(booking => booking.date === format(filterDate, 'yyyy-MM-dd'))
    : bookings;

  // Handle status update
  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update booking status"
      });
    }
  };

  // Get status badge color
  const getStatusColor = (status: Booking['status']) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-restaurant-dark-green">Table Reservations</h2>
        
        <div className="flex items-center gap-3">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {filterDate ? format(filterDate, 'PP') : 'Filter by date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filterDate}
                onSelect={(date) => {
                  setFilterDate(date);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {filterDate && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilterDate(undefined)}
            >
              Clear filter
            </Button>
          )}
          
          <Button onClick={loadBookings} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-8 bg-restaurant-cream/70 rounded-lg backdrop-blur-sm shadow-sm">
          <p className="text-lg text-gray-600">
            {filterDate 
              ? `No reservations found for ${format(filterDate, 'MMMM d, yyyy')}` 
              : 'No reservations found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-restaurant-cream/70 backdrop-blur-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Guest Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Reservation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                    <div className="text-sm text-gray-500">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">Time: {booking.time}</div>
                    <div className="text-sm text-gray-500">Guests: {booking.guests}</div>
                    {booking.specialRequests && (
                      <div className="mt-1">
                        <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-600">
                          Special Requests
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-green-600 hover:text-green-800 flex items-center gap-1"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          onClick={() => handleStatusUpdate(booking.id, 'canceled')}
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        >
                          Mark Completed
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
