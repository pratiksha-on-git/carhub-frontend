import { dealers as seed } from "@/data/dealers";
import type { Dealer } from "@/types";

let store: Dealer[] = [...seed];
export const dealerService = {
  list: () => [...store],
  approved: () => store.filter((d) => d.status === "Approved"),
  get: (id: string) => store.find((d) => d.id === id),
  update: (id: string, patch: Partial<Dealer>) => {
    store = store.map((d) => (d.id === id ? { ...d, ...patch } : d));
  },
  add: (d: Dealer) => { store = [...store, d]; },
};
