import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Region } from 'react-native-maps'
import MapAllEvents from './MapAllEvents';
import * as Location from 'expo-location'
import { Event, EventType } from '../../types/Event';
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { EVENT, firestore } from '../../firebase/Config';
import { currentTimestamp } from 'firebase/firestore/pipelines';
import { Card, Button as PaperButton, Dialog, Portal, RadioButton } from "react-native-paper";
import DateTimePickerField from '../Common/DateTimePickerField';



export default function AllEventsMapView() {
  const [location, setLocation] = useState<Region>({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [eventList, setEventList] = useState<Event[]>([])

  const [eventType, setEventType] = useState<EventType | "Molemmat">("Molemmat")
  const [typeDialogVisible, setTypeDialogVisible] = useState(false);
  const openTypeDialog = () => setTypeDialogVisible(true);
  const closeTypeDialog = () => setTypeDialogVisible(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const [date, setDate] = useState('')
  const [dateValue, setDateValue] = useState<Date>(new Date())
  const formattedDate = date
    ? new Intl.DateTimeFormat("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
    : "Valitse päivämäärä";

  const handleDateSelected = (selected: Date) => {
    setDateValue(selected);
    const iso = selected.toISOString().slice(0, 10);
    setDate(iso);
  };

  const resetFilters = () => {
    setDate('')
    setDateValue(new Date())
    setEventType('Molemmat')
  }


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
    <>
      <Text style={styles.heading}>Kaikki tapahtumat</Text>
      <View style={styles.filtersView}>
        <Card style={styles.cardContainer}>
          <Card.Content style={styles.expandableHeader} onTouchEnd={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.heading}>Suodattimet</Text>
            {isExpanded ? <Text style={styles.heading}>▲</Text> : <Text style={styles.heading}>▼</Text>}
          </Card.Content>
          {isExpanded && (
            <View style={{ padding: 16, gap: 16 }}>
              <Text style={styles.label}>Tyyppi:</Text>
              <PaperButton mode="outlined" onPress={openTypeDialog}>
                {eventType}
              </PaperButton>

              <Portal>
                <Dialog visible={typeDialogVisible} onDismiss={closeTypeDialog}>
                  <Dialog.Title>Valitse tyyppi</Dialog.Title>
                  <Dialog.Content>
                    <RadioButton.Group
                      value={eventType}
                      onValueChange={(value) => {
                        setEventType(value as EventType || null);
                        closeTypeDialog();
                      }}
                    >
                      <RadioButton.Item label="Molemmat" value="Molemmat" />
                      <RadioButton.Item label="Kävely" value="Kävely" />
                      <RadioButton.Item label="Juoksu" value="Juoksu" />
                    </RadioButton.Group>
                  </Dialog.Content>
                </Dialog>
              </Portal>


              <DateTimePickerField
                label="Päivämäärä"
                labelStyle={styles.label}
                value={dateValue}
                mode="date"
                buttonLabel={formattedDate}
                onChange={handleDateSelected}
              />




              <PaperButton mode="outlined" onPress={resetFilters}>
                Tyhjennä suodattimet
              </PaperButton>
            </View>
          )}
        </Card>
      </View>
      <View style={styles.mapContainer}>
        <Text>Tähän tulee kaikkien tapahtumien karttanäkymä</Text>
        <MapAllEvents currentRegion={location} eventList={eventList} />
      </View>

    </>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    alignContent: 'flex-start',
    marginBlockStart: 20,
    width: '100%',
    backgroundColor: 'lightgrey',
    marginBlockEnd: 10
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  basicInfoView: {
    margin: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '95%',
  },
  filtersView: {
    flex: 1,
    width: '95%',
    justifyContent: 'space-evenly',
    margin: 8
  },
  mapContainer: {
    margin: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 300

  },
  label: {
    fontWeight: "600",
  },
});