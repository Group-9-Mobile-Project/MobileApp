import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MapView, { Callout, CalloutSubview, Marker, Region } from 'react-native-maps';

interface MapProps {
    currentRegion: Region;
}

interface Event {
    title: string,
    location: { latitude: number, longitude: number }
}

interface EventList {
    currentRegion: Region,
    eventList: Event[]
}

export default function MapAllEvents({ currentRegion, eventList }: EventList) {
    return (
        <MapView style={styles.map} region={currentRegion} >
            <Marker
                coordinate={{
                    latitude: currentRegion.latitude,
                    longitude: currentRegion.longitude,
                }}
                title='Oma sijainti'
                description='Olet Tässä'
                pinColor='#565fdd'
            />
            {eventList.map((event, index) => (
                <Marker
                    coordinate={{
                        latitude: event.location.latitude,
                        longitude: event.location.longitude,
                    }}
                    key={index}
                    title={event.title}
                    description={event.title}
                    pinColor='red'
                    
                >
                    
                </Marker>
            ))}
        </MapView>
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