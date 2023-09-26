import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";

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
