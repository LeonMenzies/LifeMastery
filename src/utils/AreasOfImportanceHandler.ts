import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { AreaOfImportanceItemT } from "~types/Types";

import { getAOIColor } from "~utils/Helpers";

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

export const addAreaOfImportance = (setAlert: any, setData: any, AOI: string) => {
  const key = uuidv4();

  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance: AreaOfImportanceItemT[]) => {
        if (areaOfImportance === null) {
          areaOfImportance = [];
        }

        if (
          areaOfImportance.some(
            (obj: AreaOfImportanceItemT) => obj.AOI.toLowerCase() === AOI.toLowerCase()
          )
        ) {
          setAlert("Areas of importance must be unique");
          return;
        }

        const newAreaOfImportance = {
          key: key,
          AOI: AOI,
          Color: getAOIColor(areaOfImportance),
        };

        if (areaOfImportance.length >= 9) {
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

export const deleteAreaOfImportance = (setAlert: Function, setData: Function, keys: string[]) => {
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        const filteredAreaOfImportance = areaOfImportance.filter(
          (v: AreaOfImportanceItemT) => !keys.includes(v.key)
        );

        if (filteredAreaOfImportance >= areaOfImportance) {
          setAlert("Failed to delete AOI");
          return;
        }

        const AreaOfImportanceList = JSON.stringify(filteredAreaOfImportance);
        AsyncStorage.setItem(AOI_KEY, AreaOfImportanceList).then(() =>
          setData(filteredAreaOfImportance)
        );
      });
  } catch (e) {
    setAlert("Failed to delete AOI");
  }
};
