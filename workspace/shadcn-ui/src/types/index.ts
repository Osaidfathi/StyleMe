export type Language = 'en' | 'ar';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  gender: 'male' | 'female';
  preferredLanguage: Language;
  role: 'customer' | 'salon_owner' | 'admin';
  createdAt: Date;
}

export interface Salon {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  images: string[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'inactive' | 'pending';
  ownerId: string;
  services: Service[];
  barbers: Barber[];
  workingHours: WorkingHours;
  createdAt: Date;
}

export interface Barber {
  id: string;
  name: string;
  specialties: string[];
  bio: Record<Language, string>;
  avatar?: string;
  salonId: string;
  rating: number;
  status: 'available' | 'busy' | 'offline';
  workingHours: WorkingHours;
  createdAt: Date;
}

export interface Service {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  price: number;
  duration: number; // in minutes
  category: 'haircut' | 'coloring' | 'styling' | 'beard';
  gender: 'male' | 'female' | 'both';
}

export interface WorkingHours {
  [key: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  barberId: string;
  serviceId: string;
  appointmentTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  originalImageUrl?: string;
  selectedStyleImageUrl?: string;
  customerNotes: Record<Language, string>;
  barberInstructions: Record<Language, string>;
  price: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
}

export interface AIStyleGeneration {
  id: string;
  userId: string;
  originalImageUrl: string;
  generatedStyles: GeneratedStyle[];
  targetGender: 'male' | 'female';
  preferences: string;
  createdAt: Date;
}

export interface GeneratedStyle {
  id: string;
  imageUrl: string;
  styleType: 'haircut' | 'color' | 'beard';
  description: Record<Language, string>;
  confidence: number;
}

export interface Review {
  id: string;
  userId: string;
  salonId: string;
  barberId?: string;
  bookingId: string;
  rating: number;
  comment: Record<Language, string>;
  images?: string[];
  createdAt: Date;
}

export interface SupportTicket {
  id: string;
  userId: string;
  type: 'technical' | 'booking' | 'payment' | 'complaint' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  subject: Record<Language, string>;
  description: Record<Language, string>;
  assignedAgentId?: string;
  messages: SupportMessage[];
  createdAt: Date;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'agent' | 'system';
  message: string;
  attachments?: string[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'promotion' | 'system';
  title: Record<Language, string>;
  message: Record<Language, string>;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}