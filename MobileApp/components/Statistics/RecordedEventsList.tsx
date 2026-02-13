import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteFinal } from '../../types/Workout'
import { Card } from 'react-native-paper'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer'
import EventDetailsById from './EventDetailsById'
import globalStyles from '../../themes/GlobalStyles'
import { Spacing } from '../../themes/spacing'

interface RecordedEventsProps {
    RecordedEvents: { eventId: string, final: RouteFinal }[]
}

export default function RecordedEventsList({ RecordedEvents }: RecordedEventsProps) {
    const [items, setItems] = useState<{ eventId: string, final: RouteFinal }[]>([])

    useEffect(() => {
        setItems(RecordedEvents)
    }, [RecordedEvents])

    return (
        <View style={{ margin: Spacing.m }} >
            <Card style={globalStyles.cardContainer}>
                <Card.Content>
                    <Text style={globalStyles.heading}>Tallennetut suoritukset</Text>
                </Card.Content>

                <Card.Content style={globalStyles.cardContent}>
                    {items.map((item) => (
                        <EventDetailsById id={item.eventId} key={item.eventId} />
                    ))}
                </Card.Content>
            </Card>
        </View>
    )
}