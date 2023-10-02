import styled from "styled-components/native";
import { TouchableOpacity, Text, View, Button } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { AntDesign } from "@expo/vector-icons";
import { useSetRecoilState } from "recoil";

import { deleteAction } from "~utils/ActionsHandler";
import { alertAtom } from "~recoil/alertAtom";
import { actionsAtom } from "~recoil/actionsAtom";
import { colors } from "~styles/GlobalStyles";
import { actionsShowAddEditAtom } from "~recoil/actionsShowAddEditAtom";
import { actionItemT } from "~types/Types";

const StyledActionsListItem = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px;
  margin: 2px 30px;
`;
type ActionsListItemT = {
  item: actionItemT;
  drag: any;
  isActive: boolean;
  setActions: any;
};

export const ActionsListItem = ({ item, drag, isActive, setActions }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setActionsShowAddEdit = useSetRecoilState(actionsShowAddEditAtom);

  return (
    <ScaleDecorator key={item.key}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? colors.lightGrey : item.backgroundColor }}
        onPress={() =>
          setActionsShowAddEdit({
            show: true,
            action: item,
          })
        }
      >
        <StyledActionsListItem>
          <View>
            <Text>Actions: {item.action}</Text>
            <Text>AOL: {item.areaOfImportance}</Text>
            <Text>Date Added: {item.dateAdded}</Text>

            <Text>
              Complete:
              {item.isCompleted ? (
                <AntDesign name="check" size={20} color="black" />
              ) : (
                <AntDesign name="close" size={20} color="black" />
              )}
            </Text>
          </View>

          <Button title="Delete" onPress={() => deleteAction(setAlert, setActions, item.key)} />
        </StyledActionsListItem>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};
