import { View, Button, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RadioButton } from 'react-native-paper'
import { ChartType, RecordedEventsList, RouteFinal } from '../../types/Workout'
import MonthlyBarChart from './MonthlyBarChart'

interface AllRecordedEventsProp {
    RecordedEvents: RecordedEventsList
}

export default function GraphContainer( {RecordedEvents} : AllRecordedEventsProp) {
    const [showYearly, setShowYearly] = useState<boolean>(true)
    const [chartType, setChartType] = useState<ChartType>('Matka')
    const [allEvents, setAllEvents] = useState<RecordedEventsList>([])

    useEffect(() => {
        setAllEvents(RecordedEvents)
    }, [RecordedEvents])

    return (
        <View>
            <Button title={showYearly ? 'Näytä kuukausinäkymä' : 'Näytä vuosinäkymä'} onPress={() => setShowYearly(!showYearly)} />

            <RadioButton.Group
                onValueChange={(value) => setChartType(value as ChartType)}
                value={chartType}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, paddingRight: 10, borderColor: (chartType == 'Matka') ? 'purple': 'grey', borderWidth: 1, borderRadius: 100, backgroundColor: (chartType == 'Matka') ? 'pink': 'white'} }
                    onTouchEnd={() => setChartType('Matka')}>
                        <RadioButton value='Matka' />
                        <Text>Matka</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, paddingRight: 10, borderColor: (chartType == 'Kesto') ? 'purple': 'grey', borderWidth: 1, borderRadius: 100, backgroundColor: (chartType == 'Kesto') ? 'pink': 'white'} }
                    onTouchEnd={() => setChartType('Kesto')}>
                        <RadioButton value='Kesto' />
                        <Text>Kesto</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, paddingRight: 10, borderColor: (chartType == 'Keskinopeus') ? 'purple': 'grey', borderWidth: 1, borderRadius: 100, backgroundColor: (chartType == 'Keskinopeus') ? 'pink': 'white'} }
                    onTouchEnd={() => setChartType('Keskinopeus')}>
                        <RadioButton value='Keskinopeus' />
                        <Text>Keskinopeus</Text>
                    </View>
                </View>
            </RadioButton.Group>

            <Text>Suoritusten {chartType}</Text>
            {showYearly ?
            <>
            <Text>Vuosittain</Text>
            </>
            :
            <>
             <Text>Kuukausittain</Text>
             <MonthlyBarChart allEvents={allEvents} chartType={chartType} />
            </>}
        </View>
    )
}