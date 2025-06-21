export interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  totalSpots: number;
  availableSpots: number;
  pricePerHour: string;
  currency: string;
  type: "street" | "underground" | "mall" | "private";
  hours: string;
  features: string[];
  status: "available" | "limited" | "full";
  district: string;
  landmark?: string | null;
  lastUpdated: string;
}

export interface MapCenter {
  lat: number;
  lng: number;
}

export interface SearchFilters {
  availableOnly: boolean;
  freeOnly: boolean;
  mallOnly: boolean;
  district?: string;
}
