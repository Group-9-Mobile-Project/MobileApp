import { View, Text } from 'react-native'
import React from 'react'

export default function TextStatistics() {
    return (
        <View style={{margin: 10}}>
            <Text>Viimeiset 30 päivää lukuina:</Text>
            <Text>Suoritukset yhteensä:</Text>
            <Text>Kuljettu matka:</Text>
            <Text>Matkan keskiarvo:</Text>
            <Text>Käytetty aika:</Text>
            <Text>Keston keskiarvo:</Text>
        </View>
    )
}