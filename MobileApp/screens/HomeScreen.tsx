import React from 'react';
import { View, ScrollView } from 'react-native';
import RecentEventsList from '../components/Home/RecentEventsList';
import AllEventsMapView from '../components/Home/AllEventsMapView';
import EventStartingBanner from '../components/Home/EventStartingBanner';
import globalStyles from '../themes/GlobalStyles';
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../constants/colors';

export default function HomeScreen() {
  return (
    <LinearGradient colors={[Colors.dark.background, Colors.dark.inversePrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>
      <View style={globalStyles.container}>
        <ScrollView contentContainerStyle={globalStyles.contentContainer}>

          <EventStartingBanner />

          <RecentEventsList />

          <AllEventsMapView />

        </ScrollView>
      </View>
    </LinearGradient>
  )
}