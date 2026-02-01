import { Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Region } from 'react-native-maps';
import { Event } from '../../types/Event';
import EventInfoModal from '../Common/EventInfoModal';

interface EventList {
    currentRegion: Region,
    eventList: Event[]
}

export default function MapAllEvents({ currentRegion, eventList }: EventList) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <>
            <MapView style={styles.map} region={currentRegion} showsUserLocation>
                
                {eventList.map((event, index) => (
                    <Marker
                        coordinate={{
                            latitude: event.location.coordinates.latitude,
                            longitude: event.location.coordinates.longitude,
                        }}
                        key={index}
                        title={event.title + ' ' + event.date + ' ' + event.startTime}
                        description={ '\t' + 'Klikkaa tästä tarkastellaksesi'}
                        
                        pinColor={(event.type.toString() === "juoksu") ? "red" : "blue" }
                        onCalloutPress={() => {setSelectedEvent(event); setShowModal(true)}}
                    >
                        
                    </Marker>
                ))}
            </MapView>
            
            {(selectedEvent && showModal) && (
                
                <EventInfoModal showModal={showModal} setShowModal={setShowModal} event={selectedEvent} />
            )}
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