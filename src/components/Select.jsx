import DropDownPicker from "react-native-dropdown-picker";
import styled from "styled-components/native";
import { StyleSheet, Text, View } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <DropDownPicker
        style={styles.input}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    padding: 10,
  },
  title: {
    fontSize: 15,
  },
  input: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default Select;
