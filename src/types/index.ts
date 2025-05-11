
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface TableAvailability {
  id: string;
  tableNumber: number;
  capacity: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId?: string;
  specialRequests?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: string;
}
