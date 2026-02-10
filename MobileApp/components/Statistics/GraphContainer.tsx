import { View, Button, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RadioButton } from 'react-native-paper'
import { RouteFinal } from '../../types/Workout'

interface AllRecordedEventsProp {
    RecordedEvents: {eventId: string, final: RouteFinal}[]
}

export default function GraphContainer( {RecordedEvents} : AllRecordedEventsProp) {
    const [showYearly, setShowYearly] = useState<boolean>(true)
    const [chartType, setChartType] = useState('Matka')
    const [allEvent, setAllEvents] = useState<{eventId: string, final: RouteFinal}[]>([])

    useEffect(() => {
        setAllEvents(RecordedEvents)
    }, [])

    return (
        <View>
            <Button title={showYearly ? 'Näytä vuosinäkymä' : 'Näytä kuukausinäkymä'} onPress={() => setShowYearly(!showYearly)} />

            <RadioButton.Group
                onValueChange={(value) => setChartType(value)}
                value={chartType}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, paddingRight: 10, borderColor: (chartType == 'Matka') ? 'purple': 'grey', borderWidth: 1, borderRadius: 100, backgroundColor: (chartType == 'Matka') ? 'pink': 'white'} }>
                        <RadioButton value='Matka' />
                        <Text>Matka</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value='Kesto' />
                        <Text>Kesto</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value='Keskinopeus' />
                        <Text>Keskinopeus</Text>
                    </View>
                </View>
            </RadioButton.Group>

            <Text>Suoritusten {chartType}</Text>
        </View>
    )
}