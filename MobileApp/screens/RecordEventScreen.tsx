import { View, Text } from 'react-native'
import React from 'react'
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '../types/Navigation';

export default function RecordEventScreen() {
    const route = useRoute<RouteProp<RootTabParamList, "Tapahtuman tiedot">>();
    const navigation = useNavigation<NavigationProp<RootTabParamList>>()
    const { eventId } = route.params

    return (
        <View>
            <Text>RecordEventScreen for event: {eventId}</Text>
        </View>
    )
}