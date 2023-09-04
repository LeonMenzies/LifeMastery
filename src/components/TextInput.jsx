import { TextInput, Text, SafeAreaView } from "react-native";
import styled from "styled-components/native";

const StyledTextInput = styled.SafeAreaView`
  background-color: white;
  margin: 10px;
`;

const TextInputInnerContainer = styled.View`
  padding: 5px;
  border: solid 1px black;
  width: 100%;
  border-radius: 5px;
`;

const TextInputComponent = ({ title, value, onChangeText, placeholder, maxLength }) => {
  return (
    <StyledTextInput>
      <TextInputInnerContainer>
        <Text>{title}</Text>
        <TextInput
          onChangeText={onChangeText}
          value={value}
          placeholder={placeholder}
          keyboardType="default"
          maxLength={maxLength}
        />
      </TextInputInnerContainer>
    </StyledTextInput>
  );
};

export default TextInputComponent;
