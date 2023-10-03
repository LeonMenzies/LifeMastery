import AsyncStorage from "@react-native-async-storage/async-storage";

import { PlanT } from "~types/Types";

export const getPlan = (setAlert: Function, setData: Function, day: string) => {
  try {
    AsyncStorage.getItem(day)
      .then((plan) => JSON.parse(plan))
      .then((plan) => {
        if (plan !== null) setData(plan);
      });
  } catch (e) {
    setAlert("Failed to get plan");
  }
};

export const setPlan = (setAlert: Function, plan: PlanT, day: string) => {
  try {
    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(day, planJson);
  } catch (e) {
    setAlert("Failed to set todays plan");
  }
};
