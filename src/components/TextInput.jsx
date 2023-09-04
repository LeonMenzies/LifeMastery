import { View, Text, SafeAreaView } from "react-native";
import styled from "styled-components/native";

const StyledTextInput = styled.SafeAreaView`
  background-color: white;
`;

const TextInput = ({ title, text, onChangeText, placeholder, maxLength }) => {
  return (
    <StyledTextInput>
      <Text>{title}</Text>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder={placeholder}
        keyboardType="default"
        maxLength={maxLength}
      />
    </StyledTextInput>
  );
};

export default TextInput;
