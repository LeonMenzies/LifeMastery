import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { GenerateRandomColor } from "./Helpers";
import { AreaOfImportanceItemT } from "../types/Types";

const AOI_KEY = "aol-list";

export const getAreasOfImportance = (setAlert, setData, setLoading) => {
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        if (areaOfImportance !== null) setData(areaOfImportance);
        setLoading(false);
      });
  } catch (e) {
    setLoading(false);
    setAlert("Failed to get AOI");
  }
};

export const addAreaOfImportance = (setAlert, setData, AOI) => {
  const key = uuidv4();

  const newAreaOfImportance = {
    key: key,
    AOI: AOI,
    Color: GenerateRandomColor(),
  };
  try {
    AsyncStorage.getItem(AOI_KEY)
      .then((areaOfImportanceRaw) => JSON.parse(areaOfImportanceRaw))
      .then((areaOfImportance) => {
        if (areaOfImportance === null) {
          areaOfImportance = [];
        }

        if (areaOfImportance.length > 9) {
          setAlert("You cannot have more than 9 AOI's");
          return;
        }
        const areaOfImportanceList = JSON.stringify([newAreaOfImportance, ...areaOfImportance]);
        AsyncStorage.setItem(AOI_KEY, areaOfImportanceList).then(() => {
          setAlert("Successfully added AreaOfImportance");
          setData([newAreaOfImportance, ...areaOfImportance]);
        });
      });
  } catch (e) {
    setAlert("Failed to add AreaOfImportance");
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
          setAlert("Successfully deleted AOI");
          setData(filteredAreaOfImportance);
        });
      });
  } catch (e) {
    setAlert("Failed to delete AOI");
  }
};
