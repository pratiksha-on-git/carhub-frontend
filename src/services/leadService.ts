import { leads as seed } from "@/data/leads";
import type { Lead } from "@/types";

let store: Lead[] = [...seed];
export const leadService = {
  list: () => [...store],
  byDealer: (dealerId: string) => store.filter((l) => l.dealerId === dealerId),
  add: (l: Lead) => { store = [l, ...store]; },
  update: (id: string, patch: Partial<Lead>) => {
    store = store.map((l) => (l.id === id ? { ...l, ...patch } : l));
  },
};
