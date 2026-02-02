import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-paper'
import { UserInfo } from 'firebase/auth'
import { auth, firestore, USERINFO } from '../../firebase/Config'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { Event } from '../../types/Event'

export default function ShowUsersEvents() {

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [email, setEmail] = useState("");
    const [userEvents, setUserEvents] = useState<Event[]>([]);

    useEffect(() => {

        (async () => {

            const profile = auth.currentUser;
            const profileEmail = profile?.email;
            if (!profileEmail) return;

            setEmail(profileEmail);

            const docRef = doc(firestore, USERINFO, profileEmail);

            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const q = query(collection(firestore, 'events'), where('ownerEmail', '==', profileEmail));
                    const querySnapshot = await getDocs(q);
                    const events: Event[] = [];
                    querySnapshot.forEach((doc) => {
                        events.push({ id: doc.id, ...doc.data() } as Event);
                    });
                    setUserEvents(events);
                } else {
                    console.log("No such document!");
                }

            } catch (e) {
                console.log('getDoc error', e)
            }

        })();
    }, []);

    return (
        <View style={styles.container}>
            <Card style={styles.cardContainer}>
                <Card.Content>
                    <Text style={styles.heading}>Omat tapahtumat</Text>
                </Card.Content>
                <ScrollView>
                {userEvents.length > 0 ? (
                    userEvents.map((event) => (
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
        width: '100%',
        height: '20%',
        paddingHorizontal: 10,
        marginBottom: 100,
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
        color: '#666',
        marginVertical: 2
    },
    infoText: {
        fontSize: 12,
        padding: 5,
        fontWeight: 'bold'
    }
});