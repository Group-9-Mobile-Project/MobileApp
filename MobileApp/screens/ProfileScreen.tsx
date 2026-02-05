import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LogOutButton from '../components/Profile/LogOutButton';
import ShowUserInfo from '../components/Profile/ShowUserInfo';
import ShowUsersEvents from '../components/Profile/ShowUsersEvents';

export default function ProfileScreen() {



  return (

    <ScrollView style={styles.contentContainer}>
      <ShowUsersEvents/>
      <ShowUserInfo/>
      <LogOutButton/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 5,
  },
});