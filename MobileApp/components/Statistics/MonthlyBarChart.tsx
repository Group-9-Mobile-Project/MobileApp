import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { ChartType, RecordedEventsList } from '../../types/Workout'
import { daysInMonth, getMonthName, navigateMonth } from '../../services/chartHelpers'
import TextStatistics from './TextStatistics'
import globalStyles from '../../themes/GlobalStyles'
import { Colors } from '../../constants/colors'
import { Spacing } from '../../themes/spacing'

interface MonthlyBarChartProps {
    allEvents: RecordedEventsList,
    chartType: ChartType
}

interface BarData {
    value: number;
    label?: string;
    [key: string]: any
}

export default function MonthlyBarChart({ allEvents, chartType }: MonthlyBarChartProps) {
    const [data, setData] = useState<{ date: string, value: number }[]>([])
    const [monthAndYearFilteredEvents, setMonthAndYearFilteredEvents] = useState<RecordedEventsList>([])
    const [selectedBarIndex, setSelectedBarIndex] = useState(null)
    const [frontColor, setFrontColor] = useState(Colors.dark.secondary)
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonthName, setCurrentMonthName] = useState(getMonthName(currentMonth))

    const setColors = () => {
        switch (chartType) {
            case 'Keskinopeus':
                setFrontColor(Colors.dark.tertiary)
                break;
            case 'Matka':
                setFrontColor(Colors.dark.secondary)
                break;
            case 'Kesto':
                setFrontColor(Colors.dark.error)
                break;
        }
    }



    useEffect(() => {
        const result: { date: string, value: number }[] = []

        // result length by month, creates empty array
        for (let index = 0; index < daysInMonth(currentMonth + 1, currentYear); index++) {
            result.push({ date: (index + 1).toString(), value: 0 })
        }


        const allMonthAndYearFilteredEvents = allEvents.filter(event =>
            (new Date(event.final.startedAt).getMonth() == currentMonth) && (new Date(event.final.startedAt).getFullYear() == currentYear))
        setMonthAndYearFilteredEvents(allMonthAndYearFilteredEvents)
        allMonthAndYearFilteredEvents.forEach((item) => {
            switch (chartType) {
                case 'Keskinopeus':
                    // obviously average speed is not the sum of all averagespeeds, so last one is saved here...
                    // do we really need to calculate averages weighted by elapsed time...
                    result[new Date(item.final.startedAt).getDate() - 1].value = item.final.avgSpeedMs
                    break;
                case 'Matka':
                    result[new Date(item.final.startedAt).getDate() - 1].value += item.final.distanceMeters / 1000
                    break;
                case 'Kesto':
                    result[new Date(item.final.startedAt).getDate() - 1].value += ((item.final.elapsedSeconds) / 60)
                    break;
            }

        })

        setColors()
        setSelectedBarIndex(null)
        setData(result)
        //console.log(result)
    }, [chartType, allEvents, currentMonth, currentYear])


    return (
        <View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }}>
                <Pressable
                    style={({ pressed }) => pressed ? globalStyles.navigateMonthButtonPressed : globalStyles.navigateMonthButton}
                    onPress={() => navigateMonth(
                        -1,
                        currentMonth,
                        setCurrentMonth,
                        currentYear,
                        setCurrentYear,
                        setCurrentMonthName
                    )}><Text style={globalStyles.navigateMonthButtonText}>◄</Text></Pressable>
                <Text style={globalStyles.navigateMonthButtonText}>{currentMonthName} {currentYear}</Text>
                <Pressable
                    style={({ pressed }) => pressed ? globalStyles.navigateMonthButtonPressed : globalStyles.navigateMonthButton}
                    onPress={() => navigateMonth(
                        1,
                        currentMonth,
                        setCurrentMonth,
                        currentYear,
                        setCurrentYear,
                        setCurrentMonthName
                    )}
                ><Text style={globalStyles.navigateMonthButtonText}>►</Text></Pressable>
            </View>

            <View style={{margin: Spacing.m }}>
                <BarChart
                    data={data.map((item, index) => ({
                        ...item, label: item.date + '.',
                        topLabelComponent: () =>
                            selectedBarIndex === index ? (
                                <Text style={globalStyles.infoText}>{item.value.toFixed(1)}</Text>
                            ) : null
                    }))}
                    onPress={(_item: BarData, index: any) => { setSelectedBarIndex(selectedBarIndex === index ? null : index) }}
                    showGradient
                    frontColor={frontColor}
                    barBorderColor={frontColor}
                    barBorderWidth={2}
                    barWidth={30}
                    gradientColor={Colors.dark.onPrimary}
                    noOfSections={4}
                    xAxisLabelTextStyle={globalStyles.text}
                    yAxisTextStyle={globalStyles.text}
                    yAxisColor={Colors.dark.primary}
                    xAxisColor={Colors.dark.primary}
                    scrollToIndex={(currentMonth == new Date().getMonth()) ? Math.abs(new Date().getDate() - 3) : undefined}
                />
            </View>
            {data && <TextStatistics events={monthAndYearFilteredEvents} />}
        </View>
    )
}