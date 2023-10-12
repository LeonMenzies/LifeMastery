import AsyncStorage from "@react-native-async-storage/async-storage";

import { PlanT } from "~types/Types";

export const getPlan = (
  setAlert: Function,
  setData: Function,
  day: string,
  setLoading: Function
) => {
  try {
    AsyncStorage.getItem(day)
      .then((plan) => JSON.parse(plan))
      .then((plan) => {
        if (plan !== null) {
          setLoading(false);
          setData(plan);
        } else {
          setLoading(false);
          setData({}); //TODO: return empty day
        }
      });
  } catch (e) {
    setAlert("Failed to get plan");
  }
};

export const savePlan = (setAlert: Function, plan: PlanT, day: string) => {
  try {
    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(day, planJson).then(() => setAlert("Successfully Saved Plan"));
  } catch (e) {
    setAlert("Failed to set plan");
  }
};

export const finalizePlan = (setAlert: Function, plan: PlanT, navigation: any, day: string) => {
  try {
    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(day, planJson).then(() => {
      setAlert("Successfully Finalized Plan");
      navigation.navigate("Home");
    });
  } catch (e) {
    setAlert("Failed to set plan");
  }
};

export const clearPlan = (setAlert: Function, setData: Function, day: string) => {
  try {
    const defaultPlan = {
      key: "",
      date: "",
      focus: "",
      finalized: false,
      actionKeys: [] as string[],
    };

    AsyncStorage.setItem(day, JSON.stringify(defaultPlan)).then(() => {
      setData(defaultPlan);
      setAlert("Successfully cleared plan");
    });
  } catch (e) {
    setAlert("Failed to clear plan");
  }
};
