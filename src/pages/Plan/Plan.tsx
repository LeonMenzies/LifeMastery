import { StyleSheet, View, TouchableHighlight, Text } from "react-native";
import { useEffect, useState, FC } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { alertAtom } from "~recoil/alertAtom";
import { ThemeT } from "~types/Types";
import { getActions } from "~utils/ActionsHandler";
import { PlanCard } from "~pages/Plan/PlanCard";
import { themeAtom } from "~recoil/themeAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { TODAY_PLAN, TOMORROW_PLAN } from "~utils/Constants";
import { IconButton } from "~components/IconButton";
import { ActionAddEdit } from "~components/ActionAddEdit";

export const Plan: FC<any> = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [today, setToday] = useState(true);
  const [modalVisible, setModalVisible] = useState<{ show: boolean; newAction: boolean }>({
    show: false,
    newAction: true,
  });
  const setActions = useSetRecoilState(actionsAtom);
  const colors = useRecoilValue(themeAtom);
  const styles = styling(colors, today);

  useEffect(() => {
    getActions(setAlert, setActions);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.addContainer}>
        <IconButton
          icon={"plus"}
          color={colors.primary}
          onPress={() =>
            setModalVisible({
              show: true,
              newAction: true,
            })
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          underlayColor={colors.lightGrey}
          onPress={() => setToday(true)}
          style={styles.button}
        >
          <View style={today ? styles.underline : null}>
            <Text style={styles.buttonText}>{"Today"}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={colors.lightGrey}
          onPress={() => setToday(false)}
          style={styles.button}
        >
          <View style={today ? null : styles.underline}>
            <Text style={styles.buttonText}>{"Tomorrow"}</Text>
          </View>
        </TouchableHighlight>
      </View>
      {today ? <PlanCard day={TODAY_PLAN} /> : <PlanCard day={TOMORROW_PLAN} />}
      <ActionAddEdit
        modalVisible={modalVisible.show}
        setModalVisible={setModalVisible}
        newAction={true}
      />
    </View>
  );
};

const styling = (colors: ThemeT, today: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
    },
    addContainer: {
      width: "100%",
      paddingLeft: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      width: "100%",
    },
    button: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTomorrow: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
    },
    underline: {
      borderBottomColor: colors.textPrimary,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginBottom: 5,
    },
    buttonText: {
      fontSize: 15,
      paddingHorizontal: 10,
      paddingVertical: 3,
      color: colors.textPrimary,
    },
  });
