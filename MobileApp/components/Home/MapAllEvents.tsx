import React, { useState } from 'react'
import MapView, { Marker, Region } from 'react-native-maps';
import { Event } from '../../types/Event';
import EventMapMarker from './EventMapMarker';
import globalStyles from '../../themes/GlobalStyles';

interface EventList {
    currentRegion: Region,
    eventList: Event[]
}

export default function MapAllEvents({ currentRegion, eventList }: EventList) {
    // const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [showModal, setShowModal] = useState<boolean>(false)

    return (
        <>
            <MapView style={globalStyles.mapAllEvents} region={currentRegion} showsUserLocation>
                
                {eventList.map((event) => (
                    
                    <EventMapMarker event={event} key={event.id}/>
                    
                    
                ))}
            </MapView>
            
           
        </>
    )
}