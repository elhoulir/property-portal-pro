export interface Property {
  id: number;
  address: string;
  suburb: string;
  price: number;
  sqft: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  date: string;
  imageUrl?: string;

  // New detailed fields
  description?: string;
  features?: string[];
  yearBuilt?: number;
  parking?: number;
  lotSize?: number;
  heating?: string;
  cooling?: string;
  floorPlan?: string;
  virtualTour?: string;
  images?: string[];  // Multiple images
  status?: 'Available' | 'Pending' | 'Sold';
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface FilterState {
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  minSqft: number | null;
  maxSqft: number | null;
  suburb: string;
  dateFrom: string;
  dateTo: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'date-newest' | 'date-oldest' | 'size-asc' | 'size-desc';

export interface Stats {
  total: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgSqft: number;
  bySuburb: Record<string, number>;
  byType: Record<string, number>;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: number;
  propertyAddress: string;
  propertyPrice: number;
}