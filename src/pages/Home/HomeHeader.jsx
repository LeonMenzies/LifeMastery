import { View, Text, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";
import styled from "styled-components/native";

const StyledHomeHeader = styled.SafeAreaView`
  background-color: white
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Focus = styled.View`
  border: solid 1px black;
  border-radius: 5px;
  width: 80%;
  height: 80%;
`;

const FocusText = styled.Text`
  padding: 5px;
`;

const HomeHeader = ({ focus }) => {
  return (
    <StyledHomeHeader>
      <Focus className={"focus"}>
        <FocusText>My one key role/focus today: {focus}</FocusText>
      </Focus>
    </StyledHomeHeader>
  );
};

export default HomeHeader;
