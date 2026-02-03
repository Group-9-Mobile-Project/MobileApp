import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Region } from 'react-native-maps'
import MapAllEvents from './MapAllEvents';
import * as Location from 'expo-location'
import { Event } from '../../types/Event';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { EVENT, firestore } from '../../firebase/Config';
import { currentTimestamp } from 'firebase/firestore/pipelines';



export default function AllEventsMapView() {
  const [location, setLocation] = useState<Region>({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [eventList, setEventList] = useState<Event[]>([])

  const getCurrentLocation = async (): Promise<void> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.log('Permission denied', 'Location permission is required to show your position');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })

    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    getCurrentLocation()
  }, [])

  
  useEffect(() => {
    let today = new Date().toISOString().slice(0, 10)
    console.log(today)

    const colRef = collection(firestore, EVENT)
    const q = query(colRef, orderBy('date', 'desc'), where('date', '>=', today))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apulista: Event[] = []
      querySnapshot.forEach((doc) => {
        apulista.push(doc.data() as Event)
      })
      //console.log(apulista)
      setEventList(apulista)
    })

    return () => { unsubscribe(); };
  }, [])

  return (

    <View style={styles.mapContainer}>
      <Text>Tähän tulee kaikkien tapahtumien karttanäkymä</Text>
      <MapAllEvents currentRegion={location} eventList={eventList} />
    </View>

  )
}

const styles = StyleSheet.create({
  mapContainer: {
    margin: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 300

  },
});