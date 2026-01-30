import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Region } from 'react-native-maps'
import MapAllEvents from './MapAllEvents';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location'
import { Event } from '../../types/Event';



export default function AllEventsMapView() {
  const [location, setLocation] = useState<Region>({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [eventList, setEventList] = useState<Event[]>([
    {
      title: 'lenkki 1',
      location: {
        coordinates: { latitude: 65.0800, longitude: 25.4800 },
        name: 'OAMK',
        address: 'Yliopistokatu 1, 90570 Oulu'
      },
      id: 'J9Q0ealXjOs12q24hz5h',
      description: 'Tämä on tapahtuman kuvaus.',
      date: '2026-01-29',
      type: 'kävely',
      attendees: ['tero@testi.com', 'tero0@testi.com'],
      organizer: 'Ville-Pekka',
      startTime: '23:00',
      endTime: '',
      ownerEmail: 'ville@mail.com'
    },
    {
      title: 'lenkki 2',
      location: {
        coordinates: { latitude: 65.0650, longitude: 24.9800 },
        name: '',
        address: ''
      },
      id: '',
      description: '',
      date: '',
      type: 'juoksu',
      attendees: [],
      organizer: '',
      startTime: '',
      endTime: '',
      ownerEmail: ''
    }
  ])

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