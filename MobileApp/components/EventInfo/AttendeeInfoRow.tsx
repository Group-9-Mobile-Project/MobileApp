import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Event } from '../../types/Event'
import { UserInfo } from '../../types/UserInfo'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore, USERINFO } from '../../firebase/Config'
import { Divider } from 'react-native-paper'

interface AttendeeInfoProps {
    email: string
}

export default function AttendeeInfoRow({ email }: AttendeeInfoProps) {
    const [attendee, setAttendee] = useState<UserInfo | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

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
        <View>
            <Text style={styles.subHeading}>{attendee.name}</Text>
            <Divider bold={true}/>
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