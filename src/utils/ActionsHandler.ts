import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

import { ActionItemT, AlertT } from "~types/Types";
import { ACTION_KEY } from "./Constants";

export const updateAction = (setAlert: Function, setData: Function, action: ActionItemT, callback: () => void = null) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          const tmp = [...actions];
          tmp.forEach((element) => {
            if (element.key === action.key) {
              element.action = action.action;
              element.repeat = action.repeat;
              element.isCompleted = action.isCompleted;
              element.timeEstimate = action.timeEstimate;
              element.priority = action.priority;
              element.areaOfImportance = action.areaOfImportance;
            }
          });
          const actionsList = JSON.stringify(tmp);
          AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
            setData(tmp);
            if (callback) callback();
          });
        }
      });
  } catch (e) {
    setAlert({ message: "Failed to update action", type: "error" });
  }
};

export const getActions = (setAlert: any, setData: any, incompleteActions = false) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions: ActionItemT[]) => {
        if (actions === null) {
          actions = [];
        }

        const filteredActions = actions.filter((action: ActionItemT) => {
          let add = true;
          if (incompleteActions) {
            if (action.isCompleted) {
              add = false;
            }
          }
          return add;
        });
        setData(filteredActions);
      });
  } catch (e) {
    setAlert({ message: "Failed to get actions", type: "error" });
  }
};

export const addAction = (setAlert, setData, action, timeEstimate, areaOfImportance, repeat, showSuccess = true) => {
  const key = uuidv4();
  const newAction = {
    key: key,
    action: action,
    isCompleted: false,
    timeEstimate: timeEstimate,
    priority: 0,
    repeat: repeat,
    areaOfImportance: areaOfImportance,
    dateAdded: new Date().toLocaleDateString(),
  };

  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions === null) {
          actions = [];
        }
        if (actions.length > 1000) {
          actions.pop();
        }
        const actionsList = JSON.stringify([newAction, ...actions]);

        AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
          if (showSuccess) setAlert({ message: "Successfully added action", type: "success" });
          if (setData) setData([newAction, ...actions]);
        });
      });
  } catch (e) {
    setAlert({ message: "Failed to add action", type: "error" });
  }
};

export const deleteActions = (setAlert: (alert: AlertT) => void, setData: (actions: ActionItemT[]) => void, keys: string[]) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        const filteredActions = actions.filter((v: ActionItemT) => !keys.includes(v.key));

        if (filteredActions >= actions) {
          setAlert({ message: "Failed to delete action", type: "error" });
          return;
        }
        const actionsList = JSON.stringify(filteredActions);
        AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => setData(filteredActions));
      });
  } catch (e) {
    setAlert({ message: "Failed to delete actions", type: "error" });
  }
};

export const clearActions = (setAlert: (alert: AlertT) => void, setData) => {
  try {
    AsyncStorage.setItem(ACTION_KEY, JSON.stringify([])).then(() => {
      setData([]);
      setAlert({ message: "Successfully cleared actions", type: "success" });
    });
  } catch (e) {
    setAlert({ message: "Failed to clear actions", type: "error" });
  }
};
