import React from 'react';
import { View, ScrollView } from 'react-native';
import LogOutButton from '../components/Profile/LogOutButton';
import ShowUserInfo from '../components/Profile/ShowUserInfo';
import ShowUsersEvents from '../components/Profile/ShowUsersEvents';
import globalStyles from '../themes/GlobalStyles';
import StatisticsButton from '../components/Profile/StatisticsButton';

export default function ProfileScreen() {

  return (
    <View style={globalStyles.container} >
      <ScrollView contentContainerStyle={globalStyles.contentContainer}>
      <ShowUsersEvents/>
      <ShowUserInfo/>
      <StatisticsButton/>
      <LogOutButton/>
    </ScrollView>
    </View>
  );
}