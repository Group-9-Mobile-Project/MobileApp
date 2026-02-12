import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event, EventProps } from '../types/Event'
import { ActivityIndicator, Card } from 'react-native-paper'
import JoinEventButton from '../components/Common/JoinEventButton'
import { useNavigation, NavigationProp, useRoute, RouteProp, useIsFocused } from '@react-navigation/native'
import { RootTabParamList } from '../types/Navigation'
import { deleteEvent } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import { onSnapshot, doc } from 'firebase/firestore'
import { firestore, EVENT, USERINFO } from '../firebase/Config'
import EventAttendees from '../components/EventInfo/EventAttendees'
import AttendeeInfoModal from '../components/EventInfo/AttendeeInfoModal'
import { UserInfo } from '../types/UserInfo'


export default function EventInfoScreen() {
    const route = useRoute<RouteProp<RootTabParamList, "Tapahtuman tiedot">>();
    const { user } = useAuth()
    const navigation = useNavigation<NavigationProp<RootTabParamList>>()
    const { eventId } = route.params

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    const currentEmail = user?.email?.trim().toLowerCase() ?? null
    const eventOwnerEmail = event?.ownerEmail?.trim().toLowerCase() ?? null
    const isOwner = !!currentEmail && !!eventOwnerEmail && currentEmail === eventOwnerEmail

    const [organizer, setOrganizer] = useState<UserInfo | null>(null)
    const [showOrganizerModal, setShowOrganizerModal] = useState<boolean>(false)

    const [allowRecording, setAllowRecording] = useState<boolean>(false)
    const isFocused = useIsFocused()

    let today = new Date()
    let todayISO = today.toISOString().slice(0, 10)
    const hours = today.getHours()


    useEffect(() => {
        const docRef = doc(firestore, EVENT, eventId)

        const unsubscribe = onSnapshot(docRef, (doc) => {
            setEvent(doc.data() as Event)
            setLoading(false)
        })

        return () => { unsubscribe(); };
    }, [eventId])


    useEffect(() => {
        if (!eventOwnerEmail) return

        const docRef = doc(firestore, USERINFO, eventOwnerEmail)

        const unsubscribe = onSnapshot(docRef, (doc) => {
            setOrganizer(doc.data() as UserInfo)
            setLoading(false)
        })

        return () => { unsubscribe(); };
    }, [eventOwnerEmail])


    useEffect(() => {
        if (!event) {
            setAllowRecording(false)
            return
        }
        if ((event.date == todayISO)
            &&
            ((event.startTime.split(/\.|\:/)[0] as unknown as number >= hours - 1) && (event.startTime.split(/\.|\:/)[0] as unknown as number <= hours + 1))
            &&
            (((currentEmail) && (event.attendees.includes(currentEmail))) || isOwner)) {
            setAllowRecording(true)
        } else {
            setAllowRecording(false)
        }
    }, [isFocused, eventId, event])

    const handleDelete = () => {
        if (!event) return
        if (!isOwner) {
            Alert.alert("Ei oikeutta", "Sinulla ei ole oikeutta poistaa tätä tapahtumaa.")
            return
        }

        Alert.alert(
            "Poista tapahtuma",
            "Haluatko varmasti poistaa tämän tapahtuman?",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteEvent(event.id)
                            Alert.alert("Poistettu", "Tapahtuma poistettu")
                            navigation.goBack()
                        } catch (err) {
                            console.error("Failed to delete event", err)
                            Alert.alert("Virhe", "Tapahtuman poisto epäonnistui")
                        }
                    },
                },
            ]
        )
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.helperText}>Haetaan tapahtumaa...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={styles.centered}>
                <Text style={styles.helperText}>Tapahtumaa ei löytynyt.</Text>
            </View>
        );
    }

    return (
        <ScrollView>

            <View style={styles.modalView}>
                <Card style={styles.cardContainer}>
                    <Card.Content>
                        <Text style={styles.heading}>{event.title}</Text>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.basicInfoView}>
                            <Text style={styles.infoText}>Aika: {event.startTime}</Text>
                            <Text style={styles.infoText}>Paikka: {event.location.address}</Text>
                            <Text style={styles.infoText}>Tyyppi: {event.type}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.infoText}>Tapahtuman lisääjä: </Text>
                                <Pressable onPress={() => { setShowOrganizerModal(true) }}>
                                    <Text style={styles.organizerLink}>{event.organizer}</Text>
                                </Pressable>

                            </View>

                            <Text style={styles.infoText}>Ilmoittautuneita: {event.attendees.length}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.descriptionView}>
                            <Text style={styles.infoText}>Kuvaus:</Text>
                            <Text style={styles.infoText}>{event.description}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View>
                            {isOwner ? (

                                <View style={styles.pressableView}>
                                    <Pressable
                                        style={({ pressed }) => pressed && styles.textPressed}
                                        onPress={() => {

                                            navigation.navigate("Muokkaa tapahtumaa", { eventId: event.id })
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Muokkaa</Text>
                                    </Pressable>

                                    <Pressable
                                        style={({ pressed }) => pressed && styles.textPressed}
                                        onPress={handleDelete}
                                    >
                                        <Text style={styles.buttonText}>Poista tapahtuma</Text>
                                    </Pressable>
                                </View>

                            ) : (

                                <View style={styles.pressableView}>
                                    <JoinEventButton event={event} />
                                </View>
                            )}

                            <Pressable
                                style={({ pressed }) => pressed && styles.textPressed}
                                onPress={() => navigation.goBack()}>
                                <Text style={styles.buttonText}>Sulje</Text>
                            </Pressable>

                            {(allowRecording) && (
                                    <Pressable
                                        style={({ pressed }) => pressed && styles.textPressed}
                                        onPress={() => navigation.navigate('Tallenna tapahtuma', { eventId: event.id })}
                                    >
                                        <Text style={styles.buttonText}>Tallenna suoritus</Text>
                                    </Pressable>
                                )}

                        </View>
                    </Card.Content>

                </Card>
                {(event.attendees[0]) && <EventAttendees attendees={event.attendees} />}

            </View>

            {organizer && <AttendeeInfoModal
                showModal={showOrganizerModal}
                setShowModal={setShowOrganizerModal}
                attendee={organizer} />}
        </ScrollView>


    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24,
    },
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: 'lightgrey',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    basicInfoView: {
        margin: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '95%',
    },
    descriptionView: {
        width: '95%',
    },
    pressableView: {
        flexDirection: 'row',
        gap: 32
    },
    button: {
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'lightblue',
        width: 'auto',
        padding: 10,
    },
    buttonText: {
        backgroundColor: 'lightgrey',
        fontWeight: 'bold',
        alignItems: 'center',
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
    },
    textPressed: {
        opacity: 0.6
    },
    infoText: {
        fontSize: 12,
        padding: 5,
    },
    organizerLink: {
        fontSize: 12,
        padding: 5,
        color: "#1e88e5"
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
    },
    helperText: {
        color: "#666",
        textAlign: "center",
    },
    linkText: {
        color: "#1e88e5",
        marginTop: 8,
    },
})