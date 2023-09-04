import DropDownPicker from "react-native-dropdown-picker";
import styled from "styled-components/native";
import { TextInput, Text, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";

const StyledSelect = styled.SafeAreaView`
  background-color: white;
  margin: 10px;
  z-index: 5;
`;

const SelectInnerContainer = styled.View`
  padding: 5px;
  border: solid 1px black;
  width: 100%;
  border-radius: 5px;
`;

const Select = ({ title, options, value, setValue }) => {
  const [open, setOpen] = useState(false);
  const items = options.map((v) => ({ label: v, value: v }));

  return (
    <StyledSelect>
      <SelectInnerContainer>
        <Text>{title}</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          zIndex={999990000}
        />
      </SelectInnerContainer>
    </StyledSelect>
  );
};
export default Select;
