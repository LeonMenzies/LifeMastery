import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { generateRandomColor } from "./Helpers";
import { AreaOfImportanceItemT } from "../types/Types";

const AOI_KEY = "aol-list";