import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RecordedEventsList } from '../../types/Workout'
import globalStyles from '../../themes/GlobalStyles'
import { Card } from 'react-native-paper'
import { Spacing } from '../../themes/spacing'

interface TextStatisticsProps {
    events: RecordedEventsList
}

export default function TextStatistics({ events }: TextStatisticsProps) {
    const [filteredData, setFilteredData] = useState<RecordedEventsList | null>(null)
    const [distance, setDistance] = useState(0)
    const [elapsedTime, setElapsedTime] = useState(0)

    useEffect(() => {

        if (events.length == 0) {
            setFilteredData(null)
            return
        }
        setDistance(0)

        //console.log(events)
        var eventsDistance = 0
        var eventsTime = 0
        events.forEach(event => {
            eventsDistance += event.final.distanceMeters
            eventsTime += event.final.elapsedSeconds
        })

        setDistance(eventsDistance)
        setElapsedTime(eventsTime)
        setFilteredData(events)


    }, [events])

    if (!filteredData) return (
        <View style={{ margin: Spacing.m  }}>
            <Card style={globalStyles.cardContainer}>
                <Card.Content>
                    <Text style={globalStyles.heading}>Ei tapahtumia valittuna ajanjaksona</Text>
                </Card.Content>
            </Card>
        </View>
    )

    if (filteredData) {
        return (
            <View style={{ margin: Spacing.m }}>
                <Card style={globalStyles.cardContainer}>
                    <Card.Content>
                        <Text style={globalStyles.heading}>Valittu ajanjakso lukuina:</Text>
                    </Card.Content>
                    <Card.Content>
                        <View style={globalStyles.basicInfoView}>
                            <Text style={globalStyles.infoText}>Suoritukset yhteensä: {filteredData.length}</Text>
                            <Text style={globalStyles.infoText}>Kuljettu matka: {(distance / 1000).toFixed(2)} km</Text>
                            <Text style={globalStyles.infoText}>Matkan keskiarvo: {((distance / 1000) / filteredData.length).toFixed(2)}</Text>
                            <Text style={globalStyles.infoText}>Käytetty aika: {(elapsedTime / 60).toFixed(0)} min {(elapsedTime % 60)} s</Text>
                            <Text style={globalStyles.infoText}>Keston keskiarvo: {((elapsedTime / filteredData.length) / 60).toFixed(0)} min {((elapsedTime / filteredData.length) % 60).toFixed(0)} s</Text>
                            <Text style={globalStyles.infoText}>Keskinopeus: {((distance / 1000) / (elapsedTime / 60)).toFixed(2)} km/h</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        )
    }
}