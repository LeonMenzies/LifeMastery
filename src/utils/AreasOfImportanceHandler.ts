import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

import { generateRandomColor } from "~utils/Helpers";

const AOI_KEY = "aol-list";

export const getAreasOfImportance = (setAlert, setData) => {
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        if (areaOfImportance !== null) setData(areaOfImportance);
      });
  } catch (e) {
    setAlert("Failed to get AOI");
  }
};

export const addAreaOfImportance = (setAlert, setData, AOI) => {
  const key = uuidv4();

  const newAreaOfImportance = {
    key: key,
    AOI: AOI,
    Color: generateRandomColor(),
  };
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        if (areaOfImportance === null) {
          areaOfImportance = [];
        }

        if (areaOfImportance.length > 9) {
          setAlert("You cannot have more than 9 Areas Of Importance");
          return;
        }
        const areaOfImportanceList = JSON.stringify([newAreaOfImportance, ...areaOfImportance]);
        AsyncStorage.setItem(AOI_KEY, areaOfImportanceList).then(() => {
          setData([newAreaOfImportance, ...areaOfImportance]);
        });
      });
  } catch (e) {
    setAlert("Failed to add Area Of Importance");
  }
};

export const deleteAreaOfImportance = (setAlert, setData, key) => {
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        const filteredAreaOfImportance = areaOfImportance.filter((v) => v.key !== key);

        if (filteredAreaOfImportance >= areaOfImportance) {
          setAlert("Failed to delete AOI");
          return;
        }
        const AreaOfImportanceList = JSON.stringify(filteredAreaOfImportance);
        AsyncStorage.setItem(AOI_KEY, AreaOfImportanceList).then(() => {
          setData(filteredAreaOfImportance);
        });
      });
  } catch (e) {
    setAlert("Failed to delete AOI");
  }
};
