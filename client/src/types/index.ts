export interface User {
  id: number;
  username: string;
  fullName: string;
  occupation?: string;
  profileImage?: string;
  createdAt: Date;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  additionalImages?: string[];
  specifications?: Record<string, string>;
  suitableTasks?: string[];
  suitability?: string[];
  maxHireDuration: number;
  maxHireQuantity: number;
  careInstructions?: string;
  trainingRequired?: string;
  expertSupportRequired?: string;
  safetyInstructions?: string;
  pricePerDay: number;
  pricePerWeek?: number;
  ownerId: number;
  rating?: number;
  available: boolean;
  createdAt: Date;
}

export interface Booking {
  id: number;
  itemId: number;
  userId: number;
  startDate: Date | string;
  endDate: Date | string;
  status: "active" | "completed" | "cancelled" | "returning";
  totalPrice: number;
  location?: string;
  createdAt: Date | string;
  item?: Item;
}

export interface SavedItem {
  id: number;
  itemId: number;
  userId: number;
  savedAt: Date | string;
  item?: Item;
}

export interface RecentlyViewedItem {
  id: number;
  itemId: number;
  userId: number;
  viewedAt: Date | string;
  item?: Item;
}

export interface Testimonial {
  id: number;
  itemId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date | string;
  user?: User;
}

export interface Certificate {
  id: number;
  userId: number;
  name: string;
  issuedAt: Date | string;
}

export interface DiyProject {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  difficulty: string;
  toolsRequired: string[];
  type: string;
  createdAt: Date | string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: Date | string;
  isRead: boolean;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  path: string;
  color?: string;
}
