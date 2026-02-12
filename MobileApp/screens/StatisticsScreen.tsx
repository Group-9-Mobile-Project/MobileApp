import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import GraphContainer from '../components/Statistics/GraphContainer'
import TextStatistics from '../components/Statistics/TextStatistics'
import RecordedEventsList from '../components/Statistics/RecordedEventsList'
import { RouteFinal } from '../types/Workout'
import { listRouteFinals } from '../services/routeStorage'
import { useIsFocused } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from '../constants/colors'
import globalStyles from '../themes/GlobalStyles'

export default function StatisticsScreen() {
  const [allRecordedEvents, setAllRecordedEvents] = useState<{ eventId: string, final: RouteFinal }[]>([])
  const isFocused = useIsFocused()

  useEffect(() => {
    const load = async () => {
      const results = await listRouteFinals()
      setAllRecordedEvents(results)
    };

    load();
  }, [isFocused])

  return (
    <LinearGradient colors={[Colors.dark.background, Colors.dark.onPrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>


      <ScrollView>
        
        <GraphContainer RecordedEvents={allRecordedEvents} />

        <RecordedEventsList RecordedEvents={allRecordedEvents} />
      </ScrollView>

    </LinearGradient>
  )
}