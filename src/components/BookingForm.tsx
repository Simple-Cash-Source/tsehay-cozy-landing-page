import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { createBooking, getAvailableTables } from '../services/mockData';
import { TableAvailability, Booking } from '../types';

interface BookingFormProps {}

const BookingForm: React.FC<BookingFormProps> = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [availableTables, setAvailableTables] = useState<TableAvailability[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const timeSlots = [
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', 
    '2:00 PM', '2:30 PM', '5:00 PM', '5:30 PM', 
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM'
  ];

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      getAvailableTables(formattedDate)
        .then(tables => {
          setAvailableTables(tables.filter(table => table.isAvailable));
        })
        .catch(error => {
          console.error('Failed to fetch available tables:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch available tables. Please try again.",
          });
        });
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time for your reservation.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      // Fix: explicitly type the status as one of the allowed values from the Booking interface
      const booking: Omit<Booking, "id"> = {
        name,
        email,
        phone,
        date: formattedDate,
        time,
        guests,
        specialRequests,
        status: 'pending' as const // Using 'as const' to ensure TypeScript treats this as a literal type
      };

      await createBooking(booking);
      
      toast({
        title: "Booking Confirmed!",
        description: `Your table has been reserved for ${formattedDate} at ${time}`,
      });
      
      // Reset form
      setDate(undefined);
      setTime('');
      setName('');
      setEmail('');
      setPhone('');
      setGuests(2);
      setSpecialRequests('');
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  setCalendarOpen(false);
                }}
                disabled={(date) => {
                  // Disable dates in the past
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <select
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-earth"
            required
          >
            <option value="" disabled>Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
        
        {/* Guest Count */}
        <div className="space-y-2">
          <Label htmlFor="guests">Number of Guests</Label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-restaurant-earth"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
              <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>
      </div>

      {/* Special Requests */}
      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Any special requests, dietary requirements, or preferences"
          rows={3}
        />
      </div>

      {/* Available Tables Info */}
      {date && availableTables.length > 0 && (
        <div className="bg-restaurant-cream/70 p-4 rounded-md backdrop-blur-sm shadow-sm">
          <p className="text-restaurant-earth font-medium">
            {availableTables.length} {availableTables.length === 1 ? 'table' : 'tables'} available for this date!
          </p>
        </div>
      )}

      {date && availableTables.length === 0 && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700 font-medium">
            No tables available for this date. Please select another date.
          </p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-[#01534A] hover:bg-restaurant-brown text-white"
        disabled={isSubmitting || (date && availableTables.length === 0)}
      >
        {isSubmitting ? 'Booking...' : 'Book Table'}
      </Button>
    </form>
  );
};

export default BookingForm;
