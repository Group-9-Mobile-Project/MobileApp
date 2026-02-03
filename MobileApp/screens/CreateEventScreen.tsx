import { StyleSheet,TouchableWithoutFeedback, Keyboard} from "react-native";
import React from "react";
import EventForm from "../components/Event/EventForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateEventScreen() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
           style={styles.container}
           contentContainerStyle={styles.contentContainer}
           keyboardShouldPersistTaps="handled"
         //  enableOnAndroid 
           extraScrollHeight={24}
       >
        <EventForm />
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
