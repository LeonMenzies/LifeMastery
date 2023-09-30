import AsyncStorage from "@react-native-async-storage/async-storage";

import { PlanT } from "~types/Types";

const TODAY_PLAN = "today-plan";
const TOMORROW_PLAN = "tomorrow-plan";

export const getTodaysPlan = (setAlert: Function, setData: Function) => {
  try {
    AsyncStorage.getItem(TODAY_PLAN)
      .then((plan) => JSON.parse(plan))
      .then((plan) => {
        if (plan !== null) setData(plan);
      });
  } catch (e) {
    setAlert("Failed to get todays plan");
  }
};

export const getTomorrowsPlan = (setAlert: Function, setData: Function) => {
  try {
    AsyncStorage.getItem(TODAY_PLAN)
      .then((plan) => JSON.parse(plan))
      .then((plan) => {
        if (plan !== null) setData(plan);
      });
  } catch (e) {
    setAlert("Failed to get tomorrows plan");
  }
};

export const setTodaysPlan = (plan: PlanT, setAlert: Function, setData: Function) => {
  try {
    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(TODAY_PLAN, planJson);
  } catch (e) {
    setAlert("Failed to set todays plan");
  }
};

export const setTomorrowsPlan = (plan: PlanT, setAlert: Function, setData: Function) => {
  try {
    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(TOMORROW_PLAN, planJson);
  } catch (e) {
    setAlert("Failed to set tomorrows plan");
  }
};
