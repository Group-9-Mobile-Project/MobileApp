import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MapView, { Marker, Region } from 'react-native-maps';

interface MapProps {
    region: Region;
}

export default function MapAllEvents({ region }: MapProps) {
    return (
        <MapView style={styles.map} region={region} >
            <Marker
                coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                }}
                title='Oma sijainti'
                description='Olet Tässä'
                pinColor='#565fdd'
            />
        </MapView>
    )
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
        margin: 8
    }
});