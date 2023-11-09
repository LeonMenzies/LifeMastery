import { FC } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";
import Icon from "react-native-vector-icons/SimpleLineIcons";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type IconButtonT = {
  icon: string;
  onPress: any;
  color: string;
  disabled?: boolean;
};

export const IconButton: FC<IconButtonT> = ({ icon, onPress, color, disabled = false }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(disabled, colors);

  return (
    <TouchableOpacity style={styles.button} onPress={disabled ? undefined : onPress}>
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
