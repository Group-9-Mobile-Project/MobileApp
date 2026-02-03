import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Event, EventProps } from '../../types/Event'
import { Card, Divider } from 'react-native-paper'
import EventInfoModal from './EventInfoModal'



export default function SingleEventRow({ event }: EventProps) {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <View>

      <Pressable
        onPress={() => setShowModal(true)}

      >
        <Text style={styles.subHeading}>{event.title}</Text>
        <Text style={styles.infoText}>Aika: {event.date} - {event.startTime}</Text>
        <Text style={styles.infoText}>Paikka: {event.location.name}</Text>
        <Text style={styles.infoText}>{event.description}</Text>
      </Pressable>
      <Divider style={styles.divider} bold={true} key={event.date} />
      <EventInfoModal showModal={showModal} setShowModal={setShowModal} event={event} />

    </View>
  )
}

const styles = StyleSheet.create({
  infoText: {
    fontSize: 12,
    padding: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  divider: {
    color: '#fff',
    width: '100%',
  }
})