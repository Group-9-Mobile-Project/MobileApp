import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { ChartType, RecordedEventsList } from '../../types/Workout'
import { getMonthName } from '../../utils/chartHelpers'
import globalStyles from '../../themes/GlobalStyles'
import { Colors } from '../../constants/colors'
import { FontSizes, Spacing } from '../../themes/spacing'
import TextStatistics from './TextStatistics'

interface YearlyBarChartProps {
    allEvents: RecordedEventsList
    chartType: ChartType
}

interface BarData {
    value: number;
    label?: string;
    [key: string]: any
}

export default function YearlyBarChart({ allEvents, chartType }: YearlyBarChartProps) {
    const [data, setData] = useState<{ date: string, value: number }[]>([])
    const [monthAndYearFilteredEvents, setMonthAndYearFilteredEvents] = useState<RecordedEventsList>([])
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null)
    const [frontColor, setFrontColor] = useState(Colors.dark.secondary)
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

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

    const navigateYear = (direction: number) => {
        setCurrentYear(prev => prev + direction)
    }

    useEffect(() => {
        const result: { date: string, value: number }[] = []

        // Create empty array for 12 months
        for (let month = 0; month < 12; month++) {
            result.push({
                // Shorten the month names
                date: getMonthName(month).substring(0, 4),
                value: 0
            })
        }

        // Filter events by current year
        const yearFilteredEvents = allEvents.filter(event =>
            new Date(event.final.startedAt).getFullYear() === currentYear
        )

        // Use year-filtered events both for chart data and text statistics
        setMonthAndYearFilteredEvents(yearFilteredEvents)

        // Calculate values by month within the selected year
        yearFilteredEvents.forEach(item => {
            const eventDate = new Date(item.final.startedAt)
            const eventMonth = eventDate.getMonth()

            switch (chartType) {
                case 'Keskinopeus':
                    // Save last average speed for the month
                    result[eventMonth].value = item.final.avgSpeedMs
                    break;
                case 'Matka':
                    result[eventMonth].value += item.final.distanceMeters / 1000
                    break;
                case 'Kesto':
                    result[eventMonth].value += (item.final.elapsedSeconds) / 60
                    break;
            }
        })

        setColors()
        setSelectedBarIndex(null)
        setData(result)
    }, [chartType, allEvents, currentYear])

    return (
        <View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <Pressable
                    style={({ pressed }) => pressed ? globalStyles.navigateMonthButtonPressed : globalStyles.navigateMonthButton}
                    onPress={() => navigateYear(-1)}
                >
                    <Text style={globalStyles.navigateMonthButtonText}>◄</Text>
                </Pressable>

                <Text style={globalStyles.navigateMonthButtonText}>{currentYear}</Text>

                <Pressable
                    style={({ pressed }) => pressed ? globalStyles.navigateMonthButtonPressed : globalStyles.navigateMonthButton}
                    onPress={() => navigateYear(1)}
                >
                    <Text style={globalStyles.navigateMonthButtonText}>►</Text>
                </Pressable>
            </View>

            <View style={{ margin: Spacing.m }}>
                <BarChart
                    data={data.map((item, index) => ({
                        ...item,
                        label: item.date,
                        topLabelComponent: () =>
                            selectedBarIndex === index ? (
                                <Text style={globalStyles.infoText}>{item.value.toFixed(1)}</Text>
                            ) : null
                    }))}
                    onPress={(_item: BarData, index: any) => {
                        setSelectedBarIndex(selectedBarIndex === index ? null : index)
                    }}
                    showGradient
                    frontColor={frontColor}
                    barBorderColor={frontColor}
                    barBorderWidth={2}
                    barWidth={30}
                    yAxisExtraHeight={40}
                    gradientColor={Colors.dark.onPrimary}
                    noOfSections={4}
                    formatYLabel={(label) => parseFloat(label).toFixed(2).toString()}
                    xAxisLabelTextStyle={globalStyles.text}
                    yAxisTextStyle={globalStyles.text}
                    yAxisColor={Colors.dark.primary}
                    xAxisColor={Colors.dark.primary}
                />
            </View>
            {data && <TextStatistics events={monthAndYearFilteredEvents} />}
        </View>
    )
}