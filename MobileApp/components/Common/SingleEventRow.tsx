import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { EventProps } from '../../types/Event'
import { Divider } from 'react-native-paper'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootTabParamList } from '../../types/Navigation'
import globalStyles from '../../themes/GlobalStyles'



export default function SingleEventRow({ event }: EventProps) {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  return (
    <View style={globalStyles.singleEventView}>

      <Pressable
        onPress={() => navigation.navigate('Tapahtuman tiedot', { eventId : event.id})}

      >
        <Text style={globalStyles.subHeading}>{event.title}</Text>
        <Text style={globalStyles.infoText}>Aika: {event.date} - {event.startTime}</Text>
        <Text style={globalStyles.infoText}>Paikka: {event.location.name}</Text>
        <Text style={globalStyles.infoText}>{event.description}</Text>
      </Pressable>
      <Divider bold={true} key={event.date} />

    </View>
  )
}