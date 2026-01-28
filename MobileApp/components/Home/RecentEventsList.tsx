import { View, Text } from 'react-native'
import React, { useState } from 'react'

export default function RecentEventsList() {
    const [events, setEvents] = useState([])
    
    return (
        <View>
            <Text>Tähän listataan viisi viimeisintä Tapahtumaa lähelläsi</Text>
            
        </View>
    )
}