import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { auth, firestore, EVENT } from '../../firebase/Config'
import { EventProps } from '../../types/Event'
import { ActivityIndicator } from 'react-native-paper'
import globalStyles from '../../themes/GlobalStyles'

export default function JoinEventButton({ event }: EventProps) {
    const currentUser = auth.currentUser
    const [loading, setLoading] = useState<boolean>(false)

    const handleJoinEvent = async () => {
        if (!currentUser?.email) return

        setLoading(true)
        const docRef = doc(firestore, EVENT, event.id)
        try {
            await updateDoc(docRef, {
                attendees: arrayUnion(currentUser.email)
            })
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