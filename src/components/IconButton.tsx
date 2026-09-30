import { ComponentProps, FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/SimpleLineIcons";

import { useThemeStore } from "~store/themeStore";
import { ThemeT } from "~types/Types";

export type IconNameT = ComponentProps<typeof Icon>["name"];

type IconButtonT = {
  icon: IconNameT;
  onPress: any;
  color: string;
  disabled?: boolean;
};

export const IconButton: FC<IconButtonT> = ({ icon, onPress, color, disabled = false }) => {
  const colors = useThemeStore((s) => s.theme);
  const styles = styling(disabled, colors);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.4}
    >
      <Icon name={icon} size={20} color={disabled ? colors.lightGrey : color} />
    </TouchableOpacity>
  );
};

const styling = (disabled: boolean, colors: ThemeT) =>
  StyleSheet.create({
    button: {
      borderRadius: 50,
      padding: 10,
      zIndex: 2,
    },
  });
