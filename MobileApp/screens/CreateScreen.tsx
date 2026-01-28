import {
  StyleSheet,View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import AddEvent from "../components/CreateEvent/AddEvent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
           style={styles.container}
           contentContainerStyle={styles.contentContainer}
           keyboardShouldPersistTaps="handled"
         //  enableOnAndroid 
           extraScrollHeight={24}
       >
        <AddEvent />
       </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  }  
});
