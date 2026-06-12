export type FuelType = "Petrol" | "Diesel" | "CNG" | "Electric";
export type Transmission = "Manual" | "Automatic";
export type Ownership = "1st Owner" | "2nd Owner" | "3rd Owner";
export type LeadStatus = "New" | "Contacted" | "Converted";
export type DealerStatus = "Pending" | "Approved" | "Suspended" | "Rejected";
export type SubscriptionTier = "Basic" | "Standard" | "Premium";

export interface Vehicle {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  registrationYear: number;
  price: number;
  kmDriven: number;
  fuel: FuelType;
  transmission: Transmission;
  ownership: Ownership;
  city: string;
  images: string[];
  videoUrl?: string;
  description: string;
  insurance: string;
  financeAvailable: boolean;
  dealerId: string;
  featured: boolean;
  verified: boolean;
  views: number;
  createdAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface Dealer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  logo: string;
  showroomImage: string;
  verified: boolean;
  status: DealerStatus;
  rating: number;
  totalListings: number;
  joinedAt: string;
  subscription: SubscriptionTier;
}

export interface Lead {
  id: string;
  customerName: string;
  mobile: string;
  vehicleId: string;
  vehicleTitle: string;
  dealerId: string;
  status: LeadStatus;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionTier;
  price: number;
  listings: number | "Unlimited";
  featured: boolean;
  highlight?: boolean;
  features: string[];
}

export type AuthRole = "guest" | "dealer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  dealerId?: string;
}