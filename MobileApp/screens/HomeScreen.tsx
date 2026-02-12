import React from 'react';
import { View, ScrollView } from 'react-native';
import RecentEventsList from '../components/Home/RecentEventsList';
import AllEventsMapView from '../components/Home/AllEventsMapView';
import EventStartingBanner from '../components/Home/EventStartingBanner';
import globalStyles from '../themes/GlobalStyles';

export default function HomeScreen() {
  return (
    
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={globalStyles.contentContainer}>

        <EventStartingBanner />

        <RecentEventsList />

        <AllEventsMapView />

      </ScrollView>
    </View>
  )
}