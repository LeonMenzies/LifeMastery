import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

import { ActionItemT } from "~types/Types";

const ACTION_KEY = "action-list";

export const getAction = async (setAlert, setData, AOL_KEY, key) => {
  try {
    return await AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          actions.array.forEach((element: ActionItemT) => {
            if (element.key === key) {
              setData(element);
              AOL_KEY(false);
              return;
            }
          });
        }
        setAlert("Failed to get action");
        AOL_KEY(false);
      });
  } catch (e) {
    AOL_KEY(false);
    setAlert("Failed to get action");
  }
};

export const updateAction = async (setAlert: Function, setData: Function, action: ActionItemT) => {
  try {
    return await AsyncStorage.getItem(ACTION_KEY)
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
    dateAdded: new Date().toISOString().split("T")[0],
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

export const deleteAction = (setAlert, setData, key) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        const filteredActions = actions.filter((v) => v.key !== key);

        if (filteredActions >= actions) {
          setAlert("Failed to delete action");
          return;
        }
        const actionsList = JSON.stringify(filteredActions);
        AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
          setAlert("Successfully deleted action");
          setData(filteredActions);
        });
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
