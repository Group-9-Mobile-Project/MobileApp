import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { auth, firestore, EVENT } from '../../firebase/Config'
import { EventProps } from '../../types/Event'
import { ActivityIndicator } from 'react-native-paper'
import globalStyles from '../../themes/GlobalStyles'
import { useNotifications } from '../../hooks/useNotifications'
import * as Notifications from "expo-notifications";

export default function JoinEventButton({ event }: EventProps) {
    const currentUser = auth.currentUser
    const [loading, setLoading] = useState<boolean>(false)

    const { scheduleNotificationAsync, cancelNotificationAsync } = useNotifications();

    const sendNotification = () => {
        console.log(parseFloat(event.startTime.split('.')[0]) - 1, parseFloat(event.startTime.split('.')[1]))
        scheduleNotificationAsync({
            content: {
                title: "Tapahtuma alkaa pian",
                body: event.title + ' ' + event.startTime
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                // Actual date is that of the event, one hour before
                // date: new Date(event.date).setHours(parseFloat( event.startTime.split('.')[0]) - 1, parseFloat(event.startTime.split('.')[1])),

                // For testing, current time plus 3 seconds
                date: new Date(new Date().getTime() + 3000)
            },
            identifier: event.id
        });
    };

    const handleJoinEvent = async () => {
        if (!currentUser?.email) return

        setLoading(true)
        const docRef = doc(firestore, EVENT, event.id)
        try {
            await updateDoc(docRef, {
                attendees: arrayUnion(currentUser.email)
            })
            sendNotification()
        } catch (error) {
            console.log('updateDoc error', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancelJoinEvent = async () => {
        if (!currentUser?.email) return

        setLoading(true)
        const docRef = doc(firestore, EVENT, event.id)
        try {
            await updateDoc(docRef, {
                attendees: arrayRemove(currentUser.email)
            })
            cancelNotificationAsync(event.id)
        } catch (error) {
            console.log('updateDoc error', error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <>
            {(loading) ? (
                <>
                    <Pressable
                        style={({ pressed }) => pressed && globalStyles.textPressed}>
                        <ActivityIndicator style={globalStyles.buttonText} />
                    </Pressable>

                </>
            ) : (
                <>
                    {(currentUser?.email && event.attendees.includes(currentUser.email)) ? (
                        <>
                            <Pressable
                                style={({ pressed }) => pressed && globalStyles.textPressed}
                                onPress={() => handleCancelJoinEvent()}>
                                <Text style={globalStyles.buttonText}>Peru Ilmoittautuminen</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable
                                style={({ pressed }) => pressed && globalStyles.textPressed}
                                onPress={() => handleJoinEvent()}
                            >
                                <Text style={globalStyles.buttonText}>Ilmoittaudu</Text>
                            </Pressable>
                        </>)}
                </>)}


        </>
    )
}