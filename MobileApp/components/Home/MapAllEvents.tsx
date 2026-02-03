import { Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Region } from 'react-native-maps';
import { Event } from '../../types/Event';
import EventInfoModal from '../Common/EventInfoModal';
import EventMapMarker from './EventMapMarker';

interface EventList {
    currentRegion: Region,
    eventList: Event[]
}

export default function MapAllEvents({ currentRegion, eventList }: EventList) {
    // const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <>
            <MapView style={styles.map} region={currentRegion} showsUserLocation>
                
                {eventList.map((event, index) => (
                    
                    <EventMapMarker event={event} key={index}/>
                    
                    
                ))}
            </MapView>
            
           
        </>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
        margin: 8
    },
    callout: {
        backgroundColor: 'white',
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        height: '100%',
        position: 'relative'
    }
});