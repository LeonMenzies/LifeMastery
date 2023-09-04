import { TextInput, Text, SafeAreaView } from "react-native";
import styled from "styled-components/native";

const StyledTextInputComponent = styled.SafeAreaView`
  background-color: white;
  margin: 10px;
`;

const TextInputInnerContainer = styled.View`
  padding: 5px;
  border: solid 1px black;
  width: 100%;
  border-radius: 5px;
`;

const TextInputComponent = ({ title, text, onChangeText, placeholder, maxLength }) => {
  return (
    <StyledTextInputComponent>
      <TextInputInnerContainer>
        <Text>{title}</Text>
        <TextInput
          onChangeText={onChangeText}
          value={text}
          placeholder={placeholder}
          keyboardType="default"
          maxLength={maxLength}
        />
      </TextInputInnerContainer>
    </StyledTextInputComponent>
  );
};

export default TextInputComponent;
