import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, EVENT, firestore } from '../../firebase/Config'
import { query, orderBy, where, onSnapshot, limit } from 'firebase/firestore'
import { Event } from '../../types/Event'
import ExpandableListCard from '../Common/ExpandableListCard'
import globalStyles from '../../themes/GlobalStyles'

export default function RecentEventsList() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        let today = new Date().toISOString().slice(0, 10)
        //console.log(today)

        const colRef = collection(firestore, EVENT)
        const q = query(colRef, orderBy('date', 'asc'), where('date', '>=', today), limit(5))
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const apulista: Event[] = []
            querySnapshot.forEach((doc) => {
                apulista.push(doc.data() as Event)
            })
            //console.log(apulista)
            setEvents(apulista)
        })

        return () => { unsubscribe(); };
    }, [])

    return (
        <View style={globalStyles.EventFormContainer}>
            <ExpandableListCard
                listType={'events'}
                list={events}
                title={'Tulevia tapahtumia'}
            />
        </View>
    )
}