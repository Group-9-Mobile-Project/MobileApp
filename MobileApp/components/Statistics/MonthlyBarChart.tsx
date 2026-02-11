import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import { ChartType, RecordedEventsList } from '../../types/Workout'
import { daysInMonth, getMonthName, navigateMonth } from '../../services/chartHelpers'

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
    const [selectedBarIndex, setSelectedBarIndex] = useState(null)
    const [frontColor, setFrontColor] = useState('green')
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonthName, setCurrentMonthName] = useState(getMonthName(currentMonth))

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



    useEffect(() => {
        const result: { date: string, value: number }[] = []

        // result length by month, creates empty array
        for (let index = 0; index < daysInMonth(currentMonth + 1, currentYear); index++) {
            result.push({ date: (index + 1).toString(), value: 0 })
        }


        const monthAndYearFilteredEvents = allEvents.filter(event =>
            (new Date(event.final.startedAt).getMonth() == currentMonth) && (new Date(event.final.startedAt).getFullYear() == currentYear))
        monthAndYearFilteredEvents.forEach((item) => {
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', padding: 20, alignItems: 'center', }}>
                <Pressable
                    style={{ padding: 20 }}
                    onPress={() => navigateMonth(
                        -1,
                        currentMonth,
                        setCurrentMonth,
                        currentYear,
                        setCurrentYear,
                        setCurrentMonthName
                    )}><Text style={{ fontSize: 16, fontWeight: 'bold' }}>◄</Text></Pressable>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{currentMonthName} {currentYear}</Text>
                <Pressable
                    style={{ padding: 20 }}
                    onPress={() => navigateMonth(
                        1,
                        currentMonth,
                        setCurrentMonth,
                        currentYear,
                        setCurrentYear,
                        setCurrentMonthName
                    )}
                ><Text style={{ fontSize: 16, fontWeight: 'bold' }}>►</Text></Pressable>
            </View>

            <BarChart
                data={data.map((item, index) => ({
                    ...item, label: item.date + '.',
                    topLabelComponent: () =>
                        selectedBarIndex === index ? (
                            <Text>{item.value.toFixed(1)}</Text>
                        ) : null
                }))}
                onPress={(_item: BarData, index: any) => { setSelectedBarIndex(selectedBarIndex === index ? null : index) }}
                showGradient
                frontColor={frontColor}
                barBorderColor={frontColor}
                barBorderWidth={2}
                barWidth={30}
                color={'yellow'}
                gradientColor={'cyan'}
                noOfSections={4}
            />

        </View>
    )
}