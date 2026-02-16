import React from 'react';
import { View, ScrollView } from 'react-native';
import LogOutButton from '../components/Profile/LogOutButton';
import ShowUserInfo from '../components/Profile/ShowUserInfo';
import ShowUsersEvents from '../components/Profile/ShowUsersEvents';
import globalStyles from '../themes/GlobalStyles';
import StatisticsButton from '../components/Profile/StatisticsButton';
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../constants/colors';

export default function ProfileScreen() {

  return (
    <LinearGradient colors={[Colors.dark.background, Colors.dark.onPrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>
      <View style={globalStyles.container} >
        <ScrollView contentContainerStyle={globalStyles.contentContainer}>
          <ShowUsersEvents />
          <ShowUserInfo />
          <StatisticsButton />
          <LogOutButton />
        </ScrollView>
      </View>
    </LinearGradient>
  );
}