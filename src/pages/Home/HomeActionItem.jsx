import { TouchableOpacity, Text, View, Button } from "react-native";
import styled from "styled-components/native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { deleteAreaOfImportance } from "../../utils/AreasOfImportanceHandler";
import { alertAtom } from "../../recoil/alertAtom";
import { useSetRecoilState } from "recoil";
import { areasOfImportanceAtom } from "../../recoil/areasOfImportanceAtom";
import { useState, useEffect } from "react";

const StyledHomeActionItem = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledAOITitle = styled.View`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledAOITitleText = styled.Text`
  background-color: #bababa;
  border-radius: 5px;
  height: 90%
  width: 90%

`;

const StyledRowParent = styled.View`
  display: flex;
  flex-direction: column;
`;

const StyledRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const StyledField = styled.Text`
  border: solid 1px black;
`;

const HomeActionItem = ({ aoi, data }) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setSortedData(data.filter((v) => v.areaOfImportance === aoi));
  }, []);

  return (
    <StyledHomeActionItem>
      <StyledAOITitle style={{ width: "30%" }}>
        <StyledAOITitleText>{aoi}</StyledAOITitleText>
      </StyledAOITitle>

      <StyledRowParent style={{ width: "70%" }}>
        {sortedData.map((v) => {
          return (
            <StyledRow tyle={{ width: "100%" }}>
              <StyledField style={{ width: "70%" }}>{v.action}</StyledField>
              <StyledField style={{ width: "10%" }}>{v.priority}</StyledField>
              <StyledField style={{ width: "10%" }}>{v.timeEstimate}</StyledField>
              <StyledField style={{ width: "10%" }}>{v.isCompleted}</StyledField>
            </StyledRow>
          );
        })}
      </StyledRowParent>
    </StyledHomeActionItem>
  );
};

export default HomeActionItem;
