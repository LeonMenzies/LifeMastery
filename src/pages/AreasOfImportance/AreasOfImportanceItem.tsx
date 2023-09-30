import styled from "styled-components/native";
import { TouchableOpacity, Text, View, Button } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import { useSetRecoilState } from "recoil";

import { deleteAreaOfImportance } from "~utils/AreasOfImportanceHandler";
import { alertAtom } from "~recoil/alertAtom";
import { areasOfImportanceAtom } from "~recoil/areasOfImportanceAtom";
import { AreaOfImportanceItemT } from "~types/Types";

const StyledAreasOfImportanceItem = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px;
  margin: 2px 30px;
`;

type AreasOfImportanceItemT = {
  item: AreaOfImportanceItemT;
  drag: any;
  isActive: boolean;
};

export const AreasOfImportanceItem = ({ item, drag, isActive }: AreasOfImportanceItemT) => {
  const setAlert = useSetRecoilState(alertAtom);
  const setData = useSetRecoilState(areasOfImportanceAtom);

  return (
    <ScaleDecorator key={item.key}>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={{ backgroundColor: isActive ? item.Color : "white" }}
      >
        <StyledAreasOfImportanceItem>
          <View>
            <Text>AOI: {item.AOI}</Text>
          </View>

          <Button
            title="Delete"
            onPress={() => deleteAreaOfImportance(setAlert, setData, item.key)}
          />
        </StyledAreasOfImportanceItem>
      </TouchableOpacity>
    </ScaleDecorator>
  );
};
