import AsyncStorage from "@react-native-async-storage/async-storage";

import { PlanT } from "~types/Types";
import { TOMORROW_PLAN } from "~utils/Constants";
import { setPlanDateStringify } from "~utils/Helpers";

export const getPlan = (setAlert: Function, setData: Function, day: string) => {
  try {
    AsyncStorage.getItem(day)
      .then((plan) => JSON.parse(plan))
      .then((plan: PlanT) => {
        if (plan !== null) {
          //Handle day switch
          if (plan.date == new Date().toLocaleDateString()) {
            setData(plan);
          } else {
            AsyncStorage.getItem(TOMORROW_PLAN)
              .then((plan) => JSON.parse(plan))
              .then((plan: PlanT) => {
                if (plan !== null && plan.date == new Date().toLocaleDateString()) {
                  setData(plan);
                } else {
                  setData({
                    key: "",
                    date: "",
                    focus: "",
                    complete: false,
                    finalized: false,
                    actionKeys: [] as string[],
                  });
                }
              });
          }
        } else {
          setData({
            key: "",
            date: "",
            focus: "",
            complete: false,
            finalized: false,
            actionKeys: [] as string[],
          });
        }
      });
  } catch (e) {
    setAlert({ message: "Failed to get plan", type: "error" });
  }
};

export const savePlan = (setAlert: Function, plan: PlanT, day: string) => {
  try {
    const planJson = setPlanDateStringify(plan, day);
    AsyncStorage.setItem(day, planJson).then(() => setAlert({ message: "Successfully Saved Plan", type: "success" }));
  } catch (e) {
    setAlert({ message: "Failed to set plan", type: "error" });
  }
};

export const updatePlan = (setAlert: Function, setData: Function, plan: PlanT, day: string) => {
  try {
    AsyncStorage.getItem(day)
      .then((plan) => JSON.parse(plan))
      .then((plan) => {
        if (plan !== null) {
          const tmp: PlanT = { ...plan };

          tmp.date = plan.date;
          tmp.finalized = plan.finalized;
          tmp.complete = plan.complete;
          tmp.actionKeys = plan.actionKeys;

          const planJson = JSON.stringify(tmp);
          AsyncStorage.setItem(day, planJson).then(() => {
            setData(tmp);
          });

          if (plan !== null) {
            setData(plan);
          } else {
            setData({}); //TODO: return empty day
          }
        }
      });

    const planJson = JSON.stringify(plan);
    AsyncStorage.setItem(day, planJson);
  } catch (e) {
    setAlert({ message: "Failed to set plan", type: "error" });
  }
};

export const finalizePlan = (setAlert: Function, plan: PlanT, callBack: any, day: string) => {
  try {
    const planJson = setPlanDateStringify(plan, day);
    AsyncStorage.setItem(day, planJson).then(() => {
      setAlert({ message: "Successfully Finalized Plan", type: "success" });
      callBack();
    });
  } catch (e) {
    setAlert({ message: "Failed to set plan", type: "error" });
  }
};

export const clearPlan = (setAlert: Function, setData: Function, day: string) => {
  try {
    const defaultPlan = {
      key: "",
      date: "",
      focus: "",
      complete: false,
      finalized: false,
      actionKeys: [] as string[],
    };

    AsyncStorage.setItem(day, JSON.stringify(defaultPlan)).then(() => {
      setData(defaultPlan);
      setAlert({ message: "Successfully cleared plan", type: "success" });
    });
  } catch (e) {
    setAlert({ message: "Failed to clear plan", type: "error" });
  }
};
