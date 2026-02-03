import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import RecentEventsList from '../components/Home/RecentEventsList';
import AllEventsMapView from '../components/Home/AllEventsMapView';
import EventSearchModal from '../components/Home/EventSearchModal';

export default function HomeScreen() {
  return (

    <ScrollView contentContainerStyle={styles.scrollview}>
      <View style={styles.container}>
        <RecentEventsList />
        <EventSearchModal />
        <AllEventsMapView />
      </View>
    </ScrollView>

  );
}
const styles = StyleSheet.create({
  scrollview: {
    
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
})