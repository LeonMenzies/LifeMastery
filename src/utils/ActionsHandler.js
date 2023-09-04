import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const ACTION_KEY = "action-list";
// interface actionItem {
//   key: String;
//   action: String;
//   isCompleted: Boolean;
//   timeEstimate: String;
//   areaOfImportance: String;
//   dateAdded: Date;
// }

// export const storeData = async (value, key) => {
//   try {
//     await AsyncStorage.setItem(key, value);
//   } catch (e) {
//     // saving error
//   }
// };

// export const getData = async (key) => {
//   try {
//     return await AsyncStorage.getItem(key);
//   } catch (e) {
//     // error reading value
//   }
// };

export const getAction = async (setAlert, setData, setLoading, key) => {
  try {
    return await AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        if (actions !== null) {
          actions.array.forEach((element) => {
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

export const getActions = (setAlert, setData, setLoading) => {
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
        console.log(actions);
        if (actions !== null) setData(actions);
        setLoading(false);
      });
  } catch (e) {
    setLoading(false);
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
    areaOfImportance: areaOfImportance,
    dateAdded: new Date(),
  };
  try {
    AsyncStorage.getItem(ACTION_KEY)
      .then((actionsRaw) => JSON.parse(actionsRaw))
      .then((actions) => {
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

export const clearActions = (setAlert) => {
  try {
    AsyncStorage.setItem(ACTION_KEY, JSON.stringify([])).then(() =>
      setAlert("Successfully cleared actions")
    );
  } catch (e) {
    setAlert("Failed to clear actions");
  }
};
