import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteFinal } from '../../types/Workout'
import { Card } from 'react-native-paper'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer'
import EventDetailsById from './EventDetailsById'

interface RecordedEventsProps {
    RecordedEvents: {eventId: string, final: RouteFinal}[]
}

export default function RecordedEventsList({RecordedEvents}: RecordedEventsProps) {
    const [items, setItems] = useState<{eventId: string, final: RouteFinal}[]>([])

    useEffect(() => {
        setItems(RecordedEvents)
    }, [RecordedEvents])

    return (
        <Card>
            <Card.Title title='Tallennetut suoritukset' />
            <Card.Content style={{gap: 12}}>
                {items.map((item) => (
                    <EventDetailsById id={item.eventId} key={item.eventId} />
                ))}
            </Card.Content>
        </Card>
    )
}