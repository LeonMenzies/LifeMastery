import { create } from "zustand";
import { AlertT } from "~types/Types";

export const defaultAlert: AlertT = {
  message: "",
  type: "info",
};

type AlertStoreT = {
  alert: AlertT;
  setAlert: (alert: AlertT) => void;
};

export const useAlertStore = create<AlertStoreT>((set) => ({
  alert: defaultAlert,
  setAlert: (alert) => set({ alert }),
}));
