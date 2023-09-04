import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value, key) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // error reading value
  }
};
