import { vehicles as seed } from "@/data/vehicles";
import type { Vehicle } from "@/types";

let store: Vehicle[] = [...seed];

export const vehicleService = {
  list: () => [...store],
  get: (idOrSlug: string) => store.find((v) => v.id === idOrSlug || v.slug === idOrSlug),
  byDealer: (dealerId: string) => store.filter((v) => v.dealerId === dealerId),
  featured: () => store.filter((v) => v.featured),
  add: (v: Vehicle) => { store = [v, ...store]; },
  update: (id: string, patch: Partial<Vehicle>) => {
    store = store.map((v) => (v.id === id ? { ...v, ...patch } : v));
  },
  remove: (id: string) => { store = store.filter((v) => v.id !== id); },
};
