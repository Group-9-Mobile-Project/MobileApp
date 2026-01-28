import {
  StyleSheet,View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import AddEvent from "../components/CreateEvent/AddEvent";

export default function CreateScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <AddEvent />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
