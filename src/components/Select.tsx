import { FC, useState, ReactElement } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

type PlanT = {
  title: string;
  value: string;
  onChange: Function;
  options: {
    label: string;
    value: string;
  }[];
};

const Dropdown: FC<PlanT> = ({ title, value, onChange, options }) => {
  const [visible, setVisible] = useState(false);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onItemPress = (item): void => {
    onChange(item);
    setVisible(false);
  };

  const renderItem = ({ item }): ReactElement<any, any> => (
    <TouchableOpacity onPress={() => onItemPress(item.value)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.select} onPress={toggleDropdown}>
        <Text>{value}</Text>
        {visible ? <Icon name="caretdown" /> : <Icon name="caretleft" />}
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropDownContainer}>
          <FlatList
            style={styles.dropDown}
            data={options}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
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
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
    height: 30,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  dropDownContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    top: 50,
    padding: 10,
    zIndex: 999,
  },
  dropDown: { 
    zIndex: 2,
  },
});

export default Dropdown;
