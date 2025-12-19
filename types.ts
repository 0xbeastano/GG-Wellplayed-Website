export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  isBestValue?: boolean;
}

export interface Game {
  id: string;
  title: string;
  genre: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  badge?: string;
  quote: string;
  rating: number;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  status: 'ONGOING' | 'UPCOMING' | 'COMPLETED';
  details: string[];
  date?: string;
  cta: string;
}

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: string;
  platform: string;
  duration: string;
  price: number;
  timestamp: number;
  status: 'PENDING' | 'CONFIRMED';
}