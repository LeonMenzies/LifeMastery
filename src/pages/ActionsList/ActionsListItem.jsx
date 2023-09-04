import { TouchableOpacity, Text, SafeAreaView, Button } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { deleteAction } from "../../utils/ActionsHandler";
import { alertAtom } from "../../recoil/alertAtom";
import { useSetRecoilState } from "recoil";
import { actionsAtom } from "../../recoil/actionsAtom";

const StyledActionsListItem = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px;
  margin: 2px 30px;
`;

const ActionsListItem = ({ item, drag, isActive }) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(actionsAtom);

  return (
    <ScaleDecorator key={item.key}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? "red" : item.backgroundColor }}
      >
        <StyledActionsListItem>
          <Text>{item.action}</Text>
          <Button title="Delete" onPress={() => deleteAction(setAlert, setData, item.key)} />
        </StyledActionsListItem>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};

export default ActionsListItem;
