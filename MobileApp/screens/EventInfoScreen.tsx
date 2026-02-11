import { View, Text, Pressable, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '../types/Event'
import { ActivityIndicator, Card } from 'react-native-paper'
import JoinEventButton from '../components/Common/JoinEventButton'
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native'
import { RootTabParamList } from '../types/Navigation'
import { deleteEvent } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import { onSnapshot, doc } from 'firebase/firestore'
import { firestore, EVENT, USERINFO } from '../firebase/Config'
import EventAttendees from '../components/EventInfo/EventAttendees'
import AttendeeInfoModal from '../components/EventInfo/AttendeeInfoModal'
import { UserInfo } from '../types/UserInfo'
import globalStyles from '../themes/GlobalStyles'

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
            <View style={globalStyles.centered}>
                <ActivityIndicator size="large" />
                <Text style={globalStyles.helperText}>Haetaan tapahtumaa...</Text>
            </View>
        );
    }

    if (!event) {
        return (
            <View style={globalStyles.centered}>
                <Text style={globalStyles.helperText}>Tapahtumaa ei löytynyt.</Text>
            </View>
        );
    }

    return (
        <ScrollView>

            <View style={globalStyles.modalView}>
                <Card style={globalStyles.cardContainer}>
                    <Card.Content>
                        <Text style={globalStyles.heading}>{event.title}</Text>
                    </Card.Content>
                    <Card.Content>
                        <View style={globalStyles.basicInfoView}>
                            <Text style={globalStyles.infoText}>Aika: {event.startTime}</Text>
                            <Text style={globalStyles.infoText}>Paikka: {event.location.address}</Text>
                            <Text style={globalStyles.infoText}>Tyyppi: {event.type}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={globalStyles.infoText}>Tapahtuman lisääjä: </Text>
                                <Pressable onPress={() => { setShowOrganizerModal(true) }}>
                                    <Text style={globalStyles.organizerLink}>{event.organizer}</Text>
                                </Pressable>

                            </View>

                            <Text style={globalStyles.infoText}>Ilmoittautuneita: {event.attendees.length}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View style={globalStyles.descriptionView}>
                            <Text style={globalStyles.infoText}>Kuvaus:</Text>
                            <Text style={globalStyles.infoText}>{event.description}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View>
                            {isOwner ? (

                                <View style={globalStyles.pressableView}>
                                    <Pressable
                                        style={({ pressed }) => pressed && globalStyles.textPressed}
                                        onPress={() => {

                                            navigation.navigate("Muokkaa tapahtumaa", { eventId: event.id })
                                        }}
                                    >
                                        <Text style={globalStyles.buttonText}>Muokkaa</Text>
                                    </Pressable>

                                    <Pressable
                                        style={({ pressed }) => pressed && globalStyles.textPressed}
                                        onPress={handleDelete}
                                    >
                                        <Text style={globalStyles.buttonText}>Poista tapahtuma</Text>
                                    </Pressable>
                                </View>

                            ) : (

                                <View style={globalStyles.pressableView}>
                                    <JoinEventButton event={event} />
                                </View>
                            )}

                            <Pressable
                                style={({ pressed }) => pressed && globalStyles.textPressed}
                                onPress={() => navigation.goBack()}>
                                <Text style={globalStyles.buttonText}>Sulje</Text>
                            </Pressable>

                            {((event.date == todayISO)
                                &&
                                ((event.startTime.split(/\.|\:/)[0] as unknown as number >= hours - 1) && (event.startTime.split(/\.|\:/)[0] as unknown as number <= hours + 1))
                                &&
                                (((currentEmail) && (event.attendees.includes(currentEmail))) || isOwner)) && (
                                    <Pressable
                                        style={({ pressed }) => pressed && globalStyles.textPressed}
                                        onPress={() => navigation.navigate('Tallenna tapahtuma', { eventId: event.id })}
                                    >
                                        <Text style={globalStyles.buttonText}>Tallenna suoritus</Text>
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