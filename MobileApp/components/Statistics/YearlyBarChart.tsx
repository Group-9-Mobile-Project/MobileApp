import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { ChartType, RecordedEventsList } from '../../types/Workout'
import { getMonthName } from '../../services/chartHelpers'

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
    const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null)
    const [frontColor, setFrontColor] = useState('green')
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    const setColors = () => {
        switch (chartType) {
            case 'Keskinopeus':
                setFrontColor('orange')
                break;
            case 'Matka':
                setFrontColor('green')
                break;
            case 'Kesto':
                setFrontColor('red')
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

        // Calculate values by month
        yearFilteredEvents.forEach((item) => {
            const eventMonth = new Date(item.final.startedAt).getMonth()
            
            switch (chartType) {
                case 'Keskinopeus':
                    // obviously average speed is not the sum of all averagespeeds, so last one is saved here...
                    // do we really need to calculate averages weighted by elapsed time...
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
                padding: 20, 
                alignItems: 'center' 
            }}>
                <Pressable
                    style={{ padding: 20 }}
                    onPress={() => navigateYear(-1)}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>◄</Text>
                </Pressable>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{currentYear}</Text>
                
                <Pressable
                    style={{ padding: 20 }}
                    onPress={() => navigateYear(1)}
                >
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>►</Text>
                </Pressable>
            </View>

            <BarChart
                data={data.map((item, index) => ({
                    ...item,
                    label: item.date,
                    topLabelComponent: () =>
                        selectedBarIndex === index ? (
                            <Text>{item.value.toFixed(1)}</Text>
                        ) : null
                }))}
                onPress={(_item: BarData, index: any) => { 
                    setSelectedBarIndex(selectedBarIndex === index ? null : index) 
                }}
                showGradient
                frontColor={frontColor}
                barBorderColor={frontColor}
                barBorderWidth={2}
                barWidth={22}
                color={'yellow'}
                gradientColor={'cyan'}
                noOfSections={4}
            />
        </View>
    )
}