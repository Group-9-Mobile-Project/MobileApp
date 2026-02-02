import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, EVENT, firestore } from '../../firebase/Config'
import { query, orderBy, where, onSnapshot, limit } from 'firebase/firestore'
import { Event } from '../../types/Event'
import { Card, Divider } from 'react-native-paper'
import SingleEventRow from '../Common/SingleEventRow'

export default function RecentEventsList() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        let today = new Date().toISOString().slice(0, 10)
        console.log(today)

        const colRef = collection(firestore, EVENT)
        const q = query(colRef, orderBy('date', 'asc'), where('date', '>=', today), limit(5))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const apulista: Event[] = []
            querySnapshot.forEach((doc) => {
                apulista.push(doc.data() as Event)
            })
            console.log(apulista)
            setEvents(apulista)
        })

        return () => { unsubscribe(); };
    }, [])

    return (
        <View style={styles.container}>
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Text style={styles.heading}>Tulevia tapahtumia</Text>
                </Card.Content>
                <Card.Content>
                    <ScrollView
                        style={styles.scrollview}
                        contentContainerStyle={{ flexGrow: 1, gap: 8 }}
                        onStartShouldSetResponder={() => true}
                        nestedScrollEnabled
                        
                        >
                        {events.map((event) => (
                            <>
                            <SingleEventRow event={event} key={event.id} />
                            <Divider style={styles.divider} bold={true} key={event.date} />
                            </>
                        ))}
                    </ScrollView>
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
    },
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: 'lightgrey',
        gap: 8,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollview: {
        flexGrow: 1,
        maxHeight: 200,
    },
    divider: {
        color: '#fff',
        width: '100%',
    }
})