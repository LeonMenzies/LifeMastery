import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { actionItemT } from "../types/Types";

const ACTION_KEY = "action-list";

export const getAction = async (setAlert, setData, setLoading, key) => {
  try {
    return await AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          actions.array.forEach((element: actionItemT) => {
            if (element.key === key) {
              setData(element);
              setLoading(false);
              return;
            }
          });
        }
        setAlert("Failed to get action");
        setLoading(false);
      });
  } catch (e) {
    setLoading(false);
    setAlert("Failed to get action");
  }
};

export const completeAction = async (setAlert, setData, setLoading, key) => {
  try {
    return await AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          const tmp = [...actions];
          tmp.forEach((element) => {
            if (element.key === key) {
              element.isCompleted = !element.isCompleted;
            }
          });
          const actionsList = JSON.stringify(tmp);
          AsyncStorage.setItem(ACTION_KEY, actionsList).then(() => {
            setAlert("Successfully completed action");
            setData(tmp);
          });
        }
        setAlert("Failed to get action");
        setLoading(false);
      });
  } catch (e) {
    console.log(e);

    setLoading(false);
    setAlert("Failed to complete action");
  }
};

export const getActions = (setAlert, setData, setLoading) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) setData(actions);
        setLoading(false);
      });
  } catch (e) {
    setLoading(false);
    setAlert("Failed to get actions");
  }
};

export const addAction = (setAlert, setData, action, timeEstimate, priority, areaOfImportance) => {
  const key = uuidv4();
  const newAction = {
    key: key,
    action: action,
    isCompleted: false,
    timeEstimate: timeEstimate,
    priority: priority,
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

export const clearActions = (setAlert) => {
  try {
    AsyncStorage.setItem(ACTION_KEY, JSON.stringify([])).then(() =>
      setAlert("Successfully cleared actions")
    );
  } catch (e) {
    setAlert("Failed to clear actions");
  }
};
