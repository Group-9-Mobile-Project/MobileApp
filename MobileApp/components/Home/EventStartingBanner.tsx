import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '../../types/Event'
import { useAuth } from '../../context/AuthContext'
import { collection, query, orderBy, where, onSnapshot, or, and } from 'firebase/firestore'
import { firestore, EVENT } from '../../firebase/Config'
import { Card } from 'react-native-paper'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootTabParamList } from '../../types/Navigation'

export default function EventStartingBanner() {
    const { user } = useAuth()
    const [events, setEvents] = useState<Event[] | null>(null)
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();

    useEffect(() => {
        let today = new Date()
        let todayISO = today.toISOString().slice(0, 10)

        const hours = today.getHours()

        const profileEmail = user?.email?.trim().toLowerCase() ?? null
        if (!profileEmail) return;


        /*
    
        */

        const colRef = collection(firestore, EVENT)
        const q = query(colRef,
            and(where('date', '==', todayISO),
                or(where('ownerEmail', '==', profileEmail),
                    where('attendees', 'array-contains', profileEmail)
                )
            )
        )

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const apulista: Event[] = []

            querySnapshot.forEach((doc) => {
                apulista.push(doc.data() as Event)
            })

            let startFilteredList = apulista.filter(event => (event.startTime.split(/\.|\:/)[0] as unknown as number >= hours - 1) && (event.startTime.split(/\.|\:/)[0] as unknown as number <= hours + 1))
            setEvents(startFilteredList)
        })

        return () => { unsubscribe(); };
    }, [])


    if (events == null) return

    if (events[0]) return (
        <Card style={{ width: '100%' }}>
            <Card.Content>
                <Text>Tapahtuma alkaa pian</Text>
            </Card.Content>
            {(events[1]) ?

                <Card.Content>
                    {events && <View>
                        {events.map((item) => (
                            <Pressable onTouchEnd={() => navigation.navigate('Tapahtuman tiedot', { eventId: item.id })} key={item.title}>
                                <Text key={item.id}>{item.title}    {item.date} - {item.startTime}</Text>
                            </Pressable>

                        ))}
                    </View>
                    }
                </Card.Content>

                :
                <Card.Content>
                    <Text>{events[0].title}     {events[0].date} - {events[0].startTime}</Text>
                    <Card.Actions>
                        <Pressable onTouchEnd={() => navigation.navigate('Tapahtuman tiedot', { eventId: events[0].id })}>
                            <Text>Tapahtuman sivu</Text>
                        </Pressable>
                        <Pressable>
                            <Text>Tallenna suoritus</Text>
                        </Pressable>
                    </Card.Actions>
                </Card.Content>

            }

        </Card>
    )
}