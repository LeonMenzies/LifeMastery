import { create } from "zustand";

type NavigatorStoreT = {
  navigator: string;
  setNavigator: (navigator: string) => void;
};

export const useNavigatorStore = create<NavigatorStoreT>((set) => ({
  navigator: "home",
  setNavigator: (navigator) => set({ navigator }),
}));
