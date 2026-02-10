import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Region } from 'react-native-maps'
import MapAllEvents from './MapAllEvents';
import * as Location from 'expo-location'
import { Event, EventType } from '../../types/Event';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { EVENT, firestore } from '../../firebase/Config';
import { Card, Button as PaperButton, Dialog, Portal, RadioButton } from "react-native-paper";
import DateTimePickerField from '../Common/DateTimePickerField';
import globalStyles from '../../themes/GlobalStyles';

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

    const colRef = collection(firestore, EVENT)
    const q = query(colRef, orderBy('date', 'desc'), where('date', '>=', today))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apulista: Event[] = []
      
      
      querySnapshot.forEach((doc) => {
          apulista.push(doc.data() as Event) 
      })

      
      var dateFilteredList: Event[] = apulista
      if (date != '') {
        console.log(date)
        dateFilteredList = apulista.filter(event => event.date.trim() == date.trim())
      }

      var typeFilteredList: Event[] = dateFilteredList
      if (eventType != 'Molemmat') {
        console.log(eventType.toLowerCase())
        typeFilteredList = dateFilteredList.filter(event => event.type.toLowerCase().trim() == eventType.toLowerCase().trim())
      }
      
      //console.log(apulista)
      setEventList(typeFilteredList)
    })

    return () => { unsubscribe(); };
  }, [date, eventType])

  return (
    <>
      <Text style={globalStyles.heading}>Kaikki tapahtumat</Text>
      <View style={globalStyles.filtersView}>
        <Card style={globalStyles.cardContainer}>
          <Card.Content style={globalStyles.expandableHeader} onTouchEnd={() => setIsExpanded(!isExpanded)}>
            <Text style={globalStyles.heading}>Suodattimet</Text>
            {isExpanded ? <Text style={globalStyles.heading}>▲</Text> : <Text style={globalStyles.heading}>▼</Text>}
          </Card.Content>
          {isExpanded && (
            <View style={{ padding: 16, gap: 16 }}>
              <Text style={globalStyles.label}>Tyyppi:</Text>
              <PaperButton mode="outlined" onPress={openTypeDialog} textColor='black'>
                {eventType}
              </PaperButton>

              <Portal>
                <Dialog visible={typeDialogVisible} onDismiss={closeTypeDialog}>
                  <Dialog.Title>Valitse tyyppi</Dialog.Title>
                  <Dialog.Content>
                    <RadioButton.Group
                      value={eventType}
                      onValueChange={(value) => {
                        setEventType(value as EventType || "Molemmat");
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
                labelStyle={globalStyles.label}
                value={dateValue}
                mode="date"
                buttonLabel={formattedDate}
                onChange={handleDateSelected}
                minimumDate={new Date()}
              />




              <PaperButton mode="outlined" onPress={resetFilters} textColor='black'>
                Tyhjennä suodattimet
              </PaperButton>
            </View>
          )}
        </Card>
      </View>
      <View style={globalStyles.mapContainer}>
        <MapAllEvents currentRegion={location} eventList={eventList} />
      </View>

    </>
  )
}
