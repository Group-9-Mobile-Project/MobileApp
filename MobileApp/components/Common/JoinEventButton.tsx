import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { auth, firestore, EVENT } from '../../firebase/Config'
import { EventProps } from '../../types/Event'
import { ActivityIndicator } from 'react-native-paper'

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
                        style={({ pressed }) => pressed && styles.textPressed}>
                        <ActivityIndicator style={styles.buttonText} />
                    </Pressable>

                </>
            ) : (
                <>
                    {(currentUser?.email && event.attendees.includes(currentUser.email)) ? (
                        <>
                            <Pressable
                                style={({ pressed }) => pressed && styles.textPressed}
                                onPress={() => handleCancelJoinEvent()}>
                                <Text style={styles.buttonText}>Peru Ilmoittautuminen</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Pressable
                                style={({ pressed }) => pressed && styles.textPressed}
                                onPress={() => handleJoinEvent()}
                            >
                                <Text style={styles.buttonText}>Ilmoittaudu</Text>
                            </Pressable>
                        </>)}
                </>)}


        </>
    )
}

const styles = StyleSheet.create({
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
})