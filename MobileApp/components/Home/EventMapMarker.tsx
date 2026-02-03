import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Marker } from 'react-native-maps';
import EventInfoModal from '../Common/EventInfoModal';
import { EventProps } from '../../types/Event';

export default function EventMapMarker({ event }: EventProps) {
    const [showModal, setShowModal] = useState<boolean>(false)
    
    return (
        <Marker
            coordinate={{
                latitude: event.location.coordinates.latitude,
                longitude: event.location.coordinates.longitude,
            }}
            title={event.title + ' ' + event.date + ' ' + event.startTime}
            description={'\t' + 'Klikkaa tästä tarkastellaksesi'}

            pinColor={(event.type.toString() === "juoksu") ? "red" : "blue"}
            onCalloutPress={() => { setShowModal(true); }}

        >
            <EventInfoModal showModal={showModal} setShowModal={setShowModal} event={event} />
        </Marker>
    )
}