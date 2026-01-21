import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogOutButton from '../components/Profile/LogOutButton';

export default function ProfileScreen() {



  return (

    <View style={styles.container}>
      <LogOutButton/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});