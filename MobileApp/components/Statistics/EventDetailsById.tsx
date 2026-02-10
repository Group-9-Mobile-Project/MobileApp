import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '../../types/Event'
import { getEventById } from '../../services/eventService'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootTabParamList } from '../../types/Navigation'

interface EventIdProp {
    id: string
}


export default function EventDetailsById({ id }: EventIdProp) {
    const [event, setEvent] = useState<Event | null>(null)
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();

    useEffect(() => {
        async function getEvent() {
            const result = await getEventById(id)
            setEvent(result)
        }

        getEvent();
    }, [])

    if (!event) return (<ActivityIndicator />)
    else return (
        <View>
            <Pressable
            style={{width: '100%'}}
            onPress={() => navigation.navigate('Harjoituksen tiedot', { eventId: event.id })}>
                <Text>{event?.title}</Text>
            </Pressable>
            <Divider />
        </View>
    )
}