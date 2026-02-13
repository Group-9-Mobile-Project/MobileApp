import { View, Button, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RadioButton } from 'react-native-paper'
import { ChartType, RecordedEventsList, RouteFinal } from '../../types/Workout'
import MonthlyBarChart from './MonthlyBarChart'
import YearlyBarChart from './YearlyBarChart'
import globalStyles from '../../themes/GlobalStyles'
import { Colors } from '../../constants/colors'
import { Spacing } from '../../themes/spacing'

interface AllRecordedEventsProp {
    RecordedEvents: RecordedEventsList
}

export default function GraphContainer({ RecordedEvents }: AllRecordedEventsProp) {
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: Spacing.l }}>
                    <View style={(chartType == 'Matka') ? globalStyles.chartTypeSelected : globalStyles.chartTypeNotSelected }
                        onTouchEnd={() => setChartType('Matka')}>
                        <RadioButton value='Matka' color={Colors.dark.onSecondaryContainer} uncheckedColor={Colors.dark.onPrimaryContainer}/>
                        <Text style={(chartType == 'Matka') ? globalStyles.chartTypeSelectedText : globalStyles.chartTypeNotSelectedText}>Matka</Text>
                    </View>
                    <View style={(chartType == 'Kesto') ? globalStyles.chartTypeSelected : globalStyles.chartTypeNotSelected }
                        onTouchEnd={() => setChartType('Kesto')}>
                        <RadioButton value='Kesto' color={Colors.dark.onSecondaryContainer} uncheckedColor={Colors.dark.onPrimaryContainer}/>
                        <Text style={(chartType == 'Kesto') ? globalStyles.chartTypeSelectedText : globalStyles.chartTypeNotSelectedText}>Kesto</Text>
                    </View>
                    <View style={(chartType == 'Keskinopeus') ? globalStyles.chartTypeSelected : globalStyles.chartTypeNotSelected }
                        onTouchEnd={() => setChartType('Keskinopeus')}>
                        <RadioButton value='Keskinopeus' color={Colors.dark.onSecondaryContainer} uncheckedColor={Colors.dark.onPrimaryContainer}/>
                        <Text style={(chartType == 'Keskinopeus') ? globalStyles.chartTypeSelectedText : globalStyles.chartTypeNotSelectedText}>Keskinopeus</Text>
                    </View>
                </View>
            </RadioButton.Group>

            <View style={{alignSelf: 'center', width: '100%'}}>
                <Text style={globalStyles.statsHeading}>Suoritusten {chartType}</Text>
                {showYearly ?
                    <>
                        <Text style={globalStyles.statsHeading}>Vuosittain</Text>
                        
                        <YearlyBarChart allEvents={allEvents} chartType={chartType} />
                    </>
                    :
                    <View>
                        <Text style={globalStyles.statsHeading}>Kuukausittain</Text>

                        <MonthlyBarChart allEvents={allEvents} chartType={chartType} />
                    </View>}
            </View>
        </View>
    )
}