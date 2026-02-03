import { View, Text, StyleSheet, Touchable, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '../../types/Event'
import { UserInfo } from '../../types/UserInfo'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore, USERINFO } from '../../firebase/Config'
import { Divider } from 'react-native-paper'
import AttendeeInfoModal from './AttendeeInfoModal'

interface AttendeeInfoProps {

    email: string
}

export default function AttendeeInfoRow({ email }: AttendeeInfoProps) {
    const [attendee, setAttendee] = useState<UserInfo | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)

    useEffect(() => {
        const docRef = doc(firestore, USERINFO, email)

        const unsubscribe = onSnapshot(docRef, (doc) => {
            setAttendee(doc.data() as UserInfo)
            setLoading(false)
        })

        return () => { unsubscribe(); };
    }, [])

    if (loading) return (<></>)

    if (!loading && attendee) {
        return (
            <View style={{width: '100%'}}>
                <Pressable onPress={() => setShowModal(true)} >
                    <Text style={styles.subHeading}>{attendee.name}</Text>
                    <Divider bold={true} />
                    <AttendeeInfoModal showModal={showModal} setShowModal={setShowModal} attendee={attendee} />
                </Pressable>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    subHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 5
    },

})