import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Marker } from 'react-native-maps';
import EventInfoModal from '../Common/EventInfoModal';
import { EventProps } from '../../types/Event';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '../../types/Navigation';

export default function EventMapMarker({ event }: EventProps) {
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();
    
    return (
        <Marker
            coordinate={{
                latitude: event.location.coordinates.latitude,
                longitude: event.location.coordinates.longitude,
            }}
            title={event.title + ' ' + event.date + ' ' + event.startTime}
            description={'\t' + 'Klikkaa tästä tarkastellaksesi'}

            pinColor={(event.type.toString().toLowerCase().trim() == "juoksu") ? "red" : "blue"}
            onCalloutPress={() => { navigation.navigate('Tapahtuman tiedot', { eventId : event.id}) }}

        >

        </Marker>
    )
}