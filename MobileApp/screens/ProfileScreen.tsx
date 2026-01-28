import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LogOutButton from '../components/Profile/LogOutButton';
import ShowUserInfo from '../components/Profile/ShowUserInfo';

export default function ProfileScreen() {



  return (

    <View style={styles.container}>
      <ShowUserInfo/>
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