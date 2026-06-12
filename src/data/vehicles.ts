import type { Vehicle, FuelType, Transmission, Ownership } from "@/types";
import { dealers } from "./dealers";

const CAR_IMAGES = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1542228262-3d663b306a53?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&h=800&fit=crop",
];

function makeImages(seed: number): string[] {
  return [0, 1, 2, 3, 4].map((i) => CAR_IMAGES[(seed + i) % CAR_IMAGES.length]);
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

interface Seed {
  brand: string; model: string; variant: string; year: number; price: number;
  km: number; fuel: FuelType; trans: Transmission; own: Ownership; city: string;
  featured?: boolean;
}

const seeds: Seed[] = [
  { brand: "Hyundai", model: "Creta", variant: "SX Diesel", year: 2022, price: 1450000, km: 28000, fuel: "Diesel", trans: "Manual", own: "1st Owner", city: "Mumbai", featured: true },
  { brand: "Hyundai", model: "Creta", variant: "EX Petrol", year: 2021, price: 1180000, km: 35000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Pune" },
  { brand: "Hyundai", model: "Venue", variant: "S Plus", year: 2022, price: 980000, km: 22000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Delhi", featured: true },
  { brand: "Hyundai", model: "i20", variant: "Sportz", year: 2020, price: 720000, km: 42000, fuel: "Petrol", trans: "Manual", own: "2nd Owner", city: "Bangalore" },
  { brand: "Hyundai", model: "Verna", variant: "SX(O)", year: 2021, price: 1320000, km: 31000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Hyderabad", featured: true },
  { brand: "Hyundai", model: "Alcazar", variant: "Signature", year: 2022, price: 1890000, km: 24000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Chennai" },
  { brand: "Maruti Suzuki", model: "Swift", variant: "VXi", year: 2021, price: 620000, km: 38000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Mumbai" },
  { brand: "Maruti Suzuki", model: "Baleno", variant: "Zeta", year: 2022, price: 780000, km: 26000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Pune", featured: true },
  { brand: "Maruti Suzuki", model: "Brezza", variant: "ZXi", year: 2023, price: 1050000, km: 18000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Delhi" },
  { brand: "Maruti Suzuki", model: "Dzire", variant: "VXi", year: 2020, price: 580000, km: 48000, fuel: "Petrol", trans: "Manual", own: "2nd Owner", city: "Jaipur" },
  { brand: "Maruti Suzuki", model: "Ertiga", variant: "ZXi+", year: 2021, price: 1020000, km: 36000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Ahmedabad" },
  { brand: "Tata", model: "Nexon", variant: "XZ+", year: 2022, price: 1150000, km: 25000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Kolkata", featured: true },
  { brand: "Tata", model: "Punch", variant: "Creative", year: 2023, price: 820000, km: 14000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Bangalore" },
  { brand: "Tata", model: "Harrier", variant: "XZA+", year: 2022, price: 1980000, km: 28000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Hyderabad" },
  { brand: "Tata", model: "Tiago", variant: "XZ", year: 2021, price: 540000, km: 32000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Chennai" },
  { brand: "Tata", model: "Altroz", variant: "XZ+", year: 2022, price: 820000, km: 22000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Lucknow" },
  { brand: "Mahindra", model: "XUV700", variant: "AX7", year: 2022, price: 2280000, km: 30000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Mumbai", featured: true },
  { brand: "Mahindra", model: "Scorpio-N", variant: "Z8", year: 2023, price: 2050000, km: 12000, fuel: "Diesel", trans: "Manual", own: "1st Owner", city: "Pune" },
  { brand: "Mahindra", model: "Thar", variant: "LX 4WD", year: 2022, price: 1620000, km: 18000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Delhi" },
  { brand: "Mahindra", model: "XUV300", variant: "W8(O)", year: 2021, price: 950000, km: 33000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Jaipur" },
  { brand: "Kia", model: "Seltos", variant: "GTX+", year: 2023, price: 1850000, km: 16000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Bangalore", featured: true },
  { brand: "Kia", model: "Sonet", variant: "GTX+", year: 2022, price: 1280000, km: 21000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Hyderabad" },
  { brand: "Kia", model: "Carens", variant: "Luxury Plus", year: 2023, price: 1720000, km: 17000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Chennai" },
  { brand: "Toyota", model: "Innova Crysta", variant: "ZX", year: 2022, price: 2480000, km: 26000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Kolkata", featured: true },
  { brand: "Toyota", model: "Fortuner", variant: "4x4 AT", year: 2021, price: 3650000, km: 38000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Ahmedabad" },
  { brand: "Toyota", model: "Urban Cruiser", variant: "Premium", year: 2022, price: 1050000, km: 24000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Mumbai" },
  { brand: "Toyota", model: "Glanza", variant: "V", year: 2023, price: 820000, km: 11000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Pune" },
  { brand: "Honda", model: "City", variant: "VX", year: 2021, price: 1180000, km: 32000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Delhi" },
  { brand: "Honda", model: "Amaze", variant: "VX CVT", year: 2022, price: 880000, km: 22000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Bangalore" },
  { brand: "Honda", model: "WR-V", variant: "VX", year: 2020, price: 780000, km: 41000, fuel: "Diesel", trans: "Manual", own: "2nd Owner", city: "Hyderabad" },
  { brand: "Honda", model: "City", variant: "ZX CVT", year: 2023, price: 1480000, km: 9000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Chennai" },
  { brand: "MG", model: "Hector", variant: "Sharp", year: 2022, price: 1980000, km: 23000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Kolkata" },
  { brand: "MG", model: "Astor", variant: "Savvy", year: 2022, price: 1380000, km: 19000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Ahmedabad" },
  { brand: "MG", model: "ZS EV", variant: "Excite", year: 2023, price: 2150000, km: 11000, fuel: "Electric", trans: "Automatic", own: "1st Owner", city: "Mumbai" },
  { brand: "Skoda", model: "Kushaq", variant: "Style 1.5 TSI", year: 2022, price: 1680000, km: 22000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Pune" },
  { brand: "Skoda", model: "Slavia", variant: "Style", year: 2023, price: 1580000, km: 14000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Delhi" },
  { brand: "Volkswagen", model: "Virtus", variant: "Topline", year: 2023, price: 1620000, km: 12000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Bangalore" },
  { brand: "Volkswagen", model: "Taigun", variant: "GT", year: 2022, price: 1820000, km: 21000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Hyderabad" },
  { brand: "Volkswagen", model: "Polo", variant: "Highline Plus", year: 2020, price: 720000, km: 39000, fuel: "Petrol", trans: "Manual", own: "2nd Owner", city: "Chennai" },
  { brand: "Hyundai", model: "Grand i10 Nios", variant: "Sportz", year: 2022, price: 680000, km: 18000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Mumbai" },
  { brand: "Maruti Suzuki", model: "Wagon R", variant: "VXi", year: 2021, price: 520000, km: 28000, fuel: "CNG", trans: "Manual", own: "1st Owner", city: "Delhi" },
  { brand: "Maruti Suzuki", model: "Alto K10", variant: "VXi", year: 2023, price: 480000, km: 8000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Pune" },
  { brand: "Tata", model: "Tigor EV", variant: "XZ+", year: 2023, price: 1180000, km: 13000, fuel: "Electric", trans: "Automatic", own: "1st Owner", city: "Bangalore" },
  { brand: "Hyundai", model: "Tucson", variant: "Signature", year: 2023, price: 3250000, km: 12000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Mumbai", featured: true },
  { brand: "Mahindra", model: "Bolero Neo", variant: "N10", year: 2021, price: 880000, km: 36000, fuel: "Diesel", trans: "Manual", own: "1st Owner", city: "Jaipur" },
  { brand: "Honda", model: "Elevate", variant: "VX", year: 2023, price: 1380000, km: 10000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Hyderabad" },
  { brand: "Kia", model: "Carnival", variant: "Limousine", year: 2021, price: 2750000, km: 31000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Delhi" },
  { brand: "Toyota", model: "Hyryder", variant: "V Hybrid", year: 2023, price: 1680000, km: 9000, fuel: "Petrol", trans: "Automatic", own: "1st Owner", city: "Chennai" },
  { brand: "Tata", model: "Safari", variant: "XZA+", year: 2022, price: 2080000, km: 24000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Kolkata" },
  { brand: "MG", model: "Gloster", variant: "Savvy 7STR", year: 2022, price: 3580000, km: 22000, fuel: "Diesel", trans: "Automatic", own: "1st Owner", city: "Mumbai" },
  { brand: "Mahindra", model: "XUV400 EV", variant: "EL Pro", year: 2023, price: 1620000, km: 10000, fuel: "Electric", trans: "Automatic", own: "1st Owner", city: "Bangalore" },
  { brand: "Hyundai", model: "Aura", variant: "SX(O)", year: 2022, price: 820000, km: 19000, fuel: "Petrol", trans: "Manual", own: "1st Owner", city: "Pune" },
];

const approvedDealers = dealers.filter((d) => d.status === "Approved");

export const vehicles: Vehicle[] = seeds.map((s, i) => {
  const dealer = approvedDealers[i % approvedDealers.length];
  const title = `${s.year} ${s.brand} ${s.model} ${s.variant}`;
  return {
    id: `v${i + 1}`,
    slug: `${slug(title)}-${i + 1}`,
    title,
    brand: s.brand,
    model: s.model,
    variant: s.variant,
    year: s.year,
    registrationYear: s.year,
    price: s.price,
    kmDriven: s.km,
    fuel: s.fuel,
    transmission: s.trans,
    ownership: s.own,
    city: s.city,
    images: makeImages(i),
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: `Excellent condition ${s.year} ${s.brand} ${s.model} ${s.variant}. Single owner, well maintained with complete service history. Comprehensive insurance valid, all original documents available. ${s.fuel} engine with smooth ${s.trans.toLowerCase()} transmission. Driven only ${s.km.toLocaleString("en-IN")} km. Inspected and certified by AutoHub India.`,
    insurance: "Comprehensive — Valid till Dec 2025",
    financeAvailable: true,
    dealerId: dealer.id,
    featured: !!s.featured,
    verified: true,
    views: 200 + ((i * 137) % 1800),
    createdAt: new Date(2025, 5, (i % 28) + 1).toISOString(),
    status: "Approved",
  };
});

export const findVehicle = (idOrSlug: string) =>
  vehicles.find((v) => v.id === idOrSlug || v.slug === idOrSlug);

export const BRANDS = ["Hyundai", "Maruti Suzuki", "Tata", "Mahindra", "Kia", "Toyota", "Honda", "MG", "Skoda", "Volkswagen"];
export const CITIES = ["Mumbai", "Pune", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
export const FUELS: FuelType[] = ["Petrol", "Diesel", "CNG", "Electric"];
export const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
export const OWNERSHIPS: Ownership[] = ["1st Owner", "2nd Owner", "3rd Owner"];