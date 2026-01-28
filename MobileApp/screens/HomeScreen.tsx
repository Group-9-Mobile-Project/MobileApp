import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RecentEventsList from '../components/Home/RecentEventsList';
import AllEventsMapView from '../components/Home/AllEventsMapView';
import EventSearchModal from '../components/Home/EventSearchModal';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <RecentEventsList />
      <EventSearchModal />
      <AllEventsMapView />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})