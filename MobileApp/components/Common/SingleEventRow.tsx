import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { EventProps } from '../../types/Event'
import { Divider } from 'react-native-paper'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootTabParamList } from '../../types/Navigation'



export default function SingleEventRow({ event }: EventProps) {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <View style={styles.singleEventView}>

      <Pressable
        onPress={() => navigation.navigate('Tapahtuman tiedot', { eventId : event.id})}

      >
        <Text style={styles.subHeading}>{event.title}</Text>
        <Text style={styles.infoText}>Aika: {event.date} - {event.startTime}</Text>
        <Text style={styles.infoText}>Paikka: {event.location.name}</Text>
        <Text style={styles.infoText}>{event.description}</Text>
      </Pressable>
      <Divider bold={true} key={event.date} />

    </View>
  )
}

const styles = StyleSheet.create({
  singleEventView: {
    marginTop: 8,
    width: '100%'
  },
  infoText: {
    fontSize: 12,
    padding: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  divider: {
    color: '#fff',
    width: '100%',
  }
})