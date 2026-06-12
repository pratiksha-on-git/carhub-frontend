import type { Lead, LeadStatus } from "@/types";
import { vehicles } from "./vehicles";

const NAMES = ["Aarav Sharma","Vivaan Mehta","Aditya Kumar","Vihaan Verma","Arjun Patel","Sai Reddy","Reyansh Gupta","Ayaan Khan","Krishna Iyer","Ishaan Joshi","Ananya Singh","Diya Nair","Aadhya Rao","Kavya Pillai","Sara Banerjee","Myra Desai","Anika Bose","Pari Shah","Tara Menon","Riya Kapoor"];
const STATUSES: LeadStatus[] = ["New", "Contacted", "Converted"];

export const leads: Lead[] = Array.from({ length: 100 }).map((_, i) => {
  const vehicle = vehicles[i % vehicles.length];
  return {
    id: `l${i + 1}`,
    customerName: NAMES[i % NAMES.length],
    mobile: `+91 9${(80000000 + i * 13).toString().slice(0, 9)}`,
    vehicleId: vehicle.id,
    vehicleTitle: vehicle.title,
    dealerId: vehicle.dealerId,
    status: STATUSES[i % STATUSES.length],
    createdAt: new Date(2025, 5 + (i % 2), (i % 28) + 1).toISOString(),
  };
});