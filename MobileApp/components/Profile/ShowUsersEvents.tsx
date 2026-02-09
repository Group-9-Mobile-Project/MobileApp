import { View } from 'react-native'
import React, { useState, useCallback } from 'react'
import { firestore, USERINFO } from '../../firebase/Config'
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { Event } from '../../types/Event'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'
import ExpandableListCard from '../Common/ExpandableListCard'
import globalStyles from '../../themes/GlobalStyles'

export default function ShowUsersEvents() {

    const { user } = useAuth()
    const [email, setEmail] = useState("");
    const [userCreatedEvents, setUserCreatedEvents] = useState<Event[]>([]);
    const [userJoinedEvents, setUserJoinedEvents] = useState<Event[]>([]);

    const fetchEvents = useCallback(async () => {

        let today = new Date().toISOString().slice(0, 10)

        const profileEmail = user?.email?.trim().toLowerCase() ?? null
        if (!profileEmail) return;

        setEmail(profileEmail);

        const docRef = doc(firestore, USERINFO, profileEmail);

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const createdQ = query(
                    collection(firestore, 'events'),
                    where('ownerEmail', '==', profileEmail),
                    where('date', '>=', today),
                    orderBy('date', 'asc')
                );
                const createdSnapshot = await getDocs(createdQ);
                const createdEvents: Event[] = [];
                createdSnapshot.forEach((doc) => {
                    createdEvents.push({ id: doc.id, ...doc.data() } as Event);
                });
                setUserCreatedEvents(createdEvents);

                const joinedQ = query(
                    collection(firestore, 'events'),
                    where('attendees', 'array-contains', profileEmail),
                    where('date', '>=', today),
                    orderBy('date', 'asc')
                );
                const joinedSnapshot = await getDocs(joinedQ);
                const joinedEvents: Event[] = [];
                joinedSnapshot.forEach((doc) => {
                    const eventData = doc.data() as Event;
                    if (eventData.ownerEmail !== profileEmail) {
                        joinedEvents.push({ id: doc.id, ...doc.data() } as Event);
                    }
                });
                setUserJoinedEvents(joinedEvents);
            } else {
                console.log("No such document!");
            }

        } catch (e) {
            console.log('getDoc error', e)
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [fetchEvents])
    );

    return (
        <View style={globalStyles.EventFormContainer}>
            <ExpandableListCard
                listType={'events'}
                list={userCreatedEvents}
                title={'Omat tapahtumat'}
            />

            <ExpandableListCard
                listType={'events'}
                list={userJoinedEvents}
                title={'Liitytyt tapahtumat'}
            />
        </View>
    )
}