import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

import { ActionItemT } from "~types/Types";
import { ACTION_KEY } from "./Constants";

export const updateAction = (setAlert: Function, setData: Function, action: ActionItemT) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          const tmp = [...actions];
          tmp.forEach((element) => {
            if (element.key === action.key) {
              element.action = action.action;
              element.isCompleted = action.isCompleted;
              element.timeEstimate = action.timeEstimate;
              element.priority = action.priority;
              element.areaOfImportance = action.areaOfImportance;
            }
          });
          const actionsList = JSON.stringify(tmp);
          AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
            setData(tmp);
          });
        }
      });
  } catch (e) {
    setAlert("Failed to update action");
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
    setAlert("Failed to get actions");
  }
};

export const addAction = (setAlert, setData, action, timeEstimate, areaOfImportance) => {
  const key = uuidv4();
  const newAction = {
    key: key,
    action: action,
    isCompleted: false,
    timeEstimate: timeEstimate,
    priority: 0,
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
        if (actions.length > 99) {
          setAlert("You cannot have more than 99 actions");
          return;
        }
        const actionsList = JSON.stringify([newAction, ...actions]);
        AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
          setAlert("Successfully added action");
          setData([newAction, ...actions]);
        });
      });
  } catch (e) {
    setAlert("Failed to add action");
  }
};

export const deleteActions = (
  setAlert: (alert: string) => void,
  setData: (actions: ActionItemT[]) => void,
  keys: string[]
) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        const filteredActions = actions.filter((v: ActionItemT) => !keys.includes(v.key));

        if (filteredActions >= actions) {
          setAlert("Failed to delete action");
          return;
        }
        const actionsList = JSON.stringify(filteredActions);
        AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => setData(filteredActions));
      });
  } catch (e) {
    setAlert("Failed to clear actions");
  }
};

export const clearActions = (setAlert, setData) => {
  try {
    AsyncStorage.setItem(ACTION_KEY, JSON.stringify([])).then(() => {
      setData([]);
      setAlert("Successfully cleared actions");
    });
  } catch (e) {
    setAlert("Failed to clear actions");
  }
};
