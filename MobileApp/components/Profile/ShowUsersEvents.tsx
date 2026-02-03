import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { Card } from 'react-native-paper'
import { UserInfo } from 'firebase/auth'
import { auth, firestore, USERINFO } from '../../firebase/Config'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { Event } from '../../types/Event'
import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../context/AuthContext'

export default function ShowUsersEvents() {

    const { user } = useAuth()
    const [email, setEmail] = useState("");
    const [userCreatedEvents, setUserCreatedEvents] = useState<Event[]>([]);
    const [userJoinedEvents, setUserJoinedEvents] = useState<Event[]>([]);

    const fetchEvents = useCallback(async () => {
        const profileEmail = user?.email?.trim().toLowerCase() ?? null
        if (!profileEmail) return;

        setEmail(profileEmail);

        const docRef = doc(firestore, USERINFO, profileEmail);

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const createdQ = query(collection(firestore, 'events'), where('ownerEmail', '==', profileEmail));
                const createdSnapshot = await getDocs(createdQ);
                const createdEvents: Event[] = [];
                createdSnapshot.forEach((doc) => {
                    createdEvents.push({ id: doc.id, ...doc.data() } as Event);
                });
                setUserCreatedEvents(createdEvents);

                const joinedQ = query(collection(firestore, 'events'), where('attendees', 'array-contains', profileEmail));
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
        <View style={styles.container}>
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Text style={styles.heading}>Omat tapahtumat</Text>
                </Card.Content>
                <ScrollView>
                    {userCreatedEvents.length > 0 ? (
                        userCreatedEvents.map((event) => (
                            <Card.Content key={event.id} style={styles.eventContent}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventText}>{event.description}</Text>
                                <Text style={styles.eventText}>{event.date} {event.startTime}</Text>
                                <Text style={styles.eventText}>{event.location.name}</Text>
                            </Card.Content>
                        ))
                    ) : (
                        <Card.Content>
                            <Text style={styles.infoText}>Ei tapahtumia.</Text>
                        </Card.Content>
                    )}
                </ScrollView>
            </Card>

            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Text style={styles.heading}>Liitytyt tapahtumat</Text>
                </Card.Content>
                <ScrollView>
                    {userJoinedEvents.length > 0 ? (
                        userJoinedEvents.map((event) => (
                            <Card.Content key={event.id} style={styles.eventContent}>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                                <Text style={styles.eventText}>{event.description}</Text>
                                <Text style={styles.eventText}>{event.date} {event.startTime}</Text>
                                <Text style={styles.eventText}>{event.location.name}</Text>
                            </Card.Content>
                        ))
                    ) : (
                        <Card.Content>
                            <Text style={styles.infoText}>Ei tapahtumia.</Text>
                        </Card.Content>
                    )}
                </ScrollView>
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
        marginBlockStart: 10,
        width: '100%',
        backgroundColor: 'lightgrey'
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    eventContent: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
        marginTop: 10
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    eventText: {
        fontSize: 14,
        marginBottom: 3
    },
    infoText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666'
    }
});