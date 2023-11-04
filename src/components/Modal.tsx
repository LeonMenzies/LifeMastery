import { View, Modal as ModalReact, StyleSheet, TouchableOpacity } from "react-native";
import { useRecoilValue } from "recoil";
import { FC } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import { themeAtom } from "~recoil/themeAtom";
import { ThemeT } from "~types/Types";

type ModalT = {
  visible: boolean;
  onRequestClose: any;
  children: any;
};

export const Modal: FC<ModalT> = ({ visible, onRequestClose, children }) => {
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors);

  return (
    <ModalReact
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity style={styles.centeredView} activeOpacity={1} onPressOut={onRequestClose}>
        <TouchableOpacity style={styles.modalView} activeOpacity={1}>
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </ModalReact>
  );
};

const styling = (colors: ThemeT) =>
  StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      backgroundColor: colors.background,
      padding: 30,
      width: "80%",
      alignItems: "center",
      zIndex: 20,
    },
    closeContainer: {
      width: "100%",
      alignItems: "flex-end",
      paddingBottom: 10,
    },
    closeButton: {
      borderRadius: 50,
      padding: 10,
    },
  });
