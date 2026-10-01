import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { DataT, SettingsT } from "~types/Types";
import { STORE_VERSION } from "~utils/Constants";
import { todayISO } from "~utils/Dates";

export type BackupT = { app: "LifeMastery"; version: number; exportedAt: string; data: DataT; settings: SettingsT };

export const exportBackup = async (data: DataT, settings: SettingsT) => {
  const backup: BackupT = { app: "LifeMastery", version: STORE_VERSION, exportedAt: new Date().toISOString(), data, settings };
  const file = new File(Paths.cache, `lifemastery-backup-${todayISO()}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(backup, null, 2));
  await Sharing.shareAsync(file.uri, { mimeType: "application/json", UTI: "public.json", dialogTitle: "Save LifeMastery backup" });
};

const isArray = (v: unknown) => Array.isArray(v);
const isPlan = (p: any) => p && typeof p.date === "string" && isArray(p.actionIds) && isArray(p.completedIds) && typeof p.priorities === "object";

export const validateBackup = (value: any): BackupT | null => {
  if (!value || value.app !== "LifeMastery" || value.version !== STORE_VERSION) return null;
  const d = value.data;
  if (!d || !isArray(d.areas) || !isArray(d.actions) || !isArray(d.history) || !isPlan(d.today) || !isPlan(d.tomorrow)) return null;
  return { ...value, data: { ...d, carryOver: isArray(d.carryOver) ? d.carryOver : [] } };
};

// Returns null when the user cancels; throws when the file isn't a valid backup.
export const pickBackup = async (): Promise<BackupT | null> => {
  const result = await DocumentPicker.getDocumentAsync({ type: ["application/json", "public.json", "*/*"], copyToCacheDirectory: true });
  if (result.canceled) return null;
  const text = await new File(result.assets[0].uri).text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("That file isn't a LifeMastery backup.");
  }
  const backup = validateBackup(parsed);
  if (!backup) throw new Error("That file isn't a LifeMastery backup.");
  return backup;
};
