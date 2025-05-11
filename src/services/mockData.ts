
import { MenuItem, TableAvailability, GalleryImage } from "../types";

// Mock menu items
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Traditional Kitfo",
    description: "Freshly minced raw beef seasoned with mitmita (spicy chili powder) and niter kibbeh (clarified butter infused with herbs and spices).",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1608835291093-394b0c943a75?w=800&auto=format&fit=crop&q=80",
    category: "Signature Dishes"
  },
  {
    id: "2",
    name: "Lega Tibs",
    description: "Tender pieces of meat sautéed with rosemary, onions, and peppers, served sizzling hot.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1605491130710-81aef37f9635?w=800&auto=format&fit=crop&q=80",
    category: "Main Courses"
  },
  {
    id: "3",
    name: "Vegetarian Combo",
    description: "A combination of various vegetarian dishes including misir wot (spicy red lentils), kik alicha (split peas), gomen (collard greens), and tikil gomen (cabbage and carrots).",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1567982047351-76b6f93e9073?w=800&auto=format&fit=crop&q=80",
    category: "Vegetarian"
  },
  {
    id: "4",
    name: "Doro Wot",
    description: "Spicy chicken stew simmered with berbere spice, served with a hard-boiled egg.",
    price: 17.99,
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=800&auto=format&fit=crop&q=80",
    category: "Main Courses"
  },
  {
    id: "5",
    name: "Shiro",
    description: "A thick, spicy stew made from ground chickpeas, often served with injera.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800&auto=format&fit=crop&q=80",
    category: "Vegetarian"
  },
  {
    id: "6",
    name: "Ethiopian Coffee Ceremony",
    description: "Traditional coffee ceremony with freshly roasted beans, served with popcorn.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1518057111178-44a106bad636?w=800&auto=format&fit=crop&q=80",
    category: "Beverages"
  },
];

// Mock table availability data
export const tables: TableAvailability[] = [
  {
    id: "t1",
    tableNumber: 1,
    capacity: 2,
    isAvailable: true
  },
  {
    id: "t2",
    tableNumber: 2,
    capacity: 4,
    isAvailable: true
  },
  {
    id: "t3",
    tableNumber: 3,
    capacity: 6,
    isAvailable: false
  },
  {
    id: "t4",
    tableNumber: 4,
    capacity: 4,
    isAvailable: true
  },
  {
    id: "t5",
    tableNumber: 5,
    capacity: 8,
    isAvailable: true
  },
  {
    id: "t6",
    tableNumber: 6,
    capacity: 2,
    isAvailable: false
  },
];

// Mock gallery images
export const galleryImages: GalleryImage[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop&q=80",
    alt: "Restaurant interior view with traditional Ethiopian decor",
    category: "Interior"
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    alt: "Cozy seating area with traditional low tables",
    category: "Interior"
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    alt: "Chef preparing traditional Ethiopian dishes",
    category: "Kitchen"
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop&q=80",
    alt: "Beautiful plating of Ethiopian cuisine",
    category: "Food"
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop&q=80",
    alt: "Traditional coffee ceremony setup",
    category: "Culture"
  },
  {
    id: "g6",
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=80",
    alt: "Exterior view of the restaurant",
    category: "Exterior"
  }
];

// Mock data service functions
export const getMenuItems = (): Promise<MenuItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(menuItems), 300);
  });
};

export const getAvailableTables = (date: string): Promise<TableAvailability[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(tables), 300);
  });
};

export const getGalleryImages = (): Promise<GalleryImage[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(galleryImages), 300);
  });
};

export const createBooking = (booking: Omit<Booking, "id">): Promise<Booking> => {
  return new Promise((resolve) => {
    const newBooking = {
      ...booking,
      id: `booking-${Date.now()}`
    };
    setTimeout(() => resolve(newBooking), 500);
  });
};

export const updateTableAvailability = (tableId: string, isAvailable: boolean): Promise<TableAvailability> => {
  return new Promise((resolve, reject) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) {
      reject(new Error("Table not found"));
      return;
    }
    
    table.isAvailable = isAvailable;
    setTimeout(() => resolve(table), 300);
  });
};

export const updateMenuItem = (menuItem: MenuItem): Promise<MenuItem> => {
  return new Promise((resolve, reject) => {
    const index = menuItems.findIndex(item => item.id === menuItem.id);
    if (index === -1) {
      reject(new Error("Menu item not found"));
      return;
    }
    
    menuItems[index] = menuItem;
    setTimeout(() => resolve(menuItem), 300);
  });
};

export const addMenuItem = (menuItem: Omit<MenuItem, "id">): Promise<MenuItem> => {
  return new Promise((resolve) => {
    const newItem = {
      ...menuItem,
      id: `menu-${Date.now()}`
    };
    
    menuItems.push(newItem);
    setTimeout(() => resolve(newItem), 300);
  });
};
