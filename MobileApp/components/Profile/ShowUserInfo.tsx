import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, TextInput, View, Text, Pressable } from 'react-native';
import { firestore } from '../../firebase/Config';
import React, { useState } from 'react';
import EditUserInfo from './EditUserInfo';

export default function ShowUserInfo() {

const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Text>Omat tiedot</Text>

        <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => pressed && styles.textPressed}
        accessibilityRole="button"
        accessibilityLabel="Show modal message"
        >
            <Text style={styles.triggerText}>Muokkaa omia tietojasi</Text>
        </Pressable>

        {modalVisible && <EditUserInfo/>}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerText: {
    color: 'black',
    fontSize: 16,
  },
  textPressed: {
    opacity: 0.6,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  modalView: {
    width: '100%',
    height: '20%',
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 60,
    textAlign: 'center',
  },
  closeTextPressed: {
    opacity: 0.7,
  },
  closeButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
});