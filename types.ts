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