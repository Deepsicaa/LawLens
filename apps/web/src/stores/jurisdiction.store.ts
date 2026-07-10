import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Jurisdiction } from "types";

interface JurisdictionStore {
  selected: Jurisdiction;
  setJurisdiction: (j: Jurisdiction) => void;
}

export const useJurisdictionStore = create<JurisdictionStore>()(
  persist(
    (set) => ({
      selected: "india",
      setJurisdiction: (j) => set({ selected: j }),
    }),
    { name: "lawlens-jurisdiction" }
  )
);
