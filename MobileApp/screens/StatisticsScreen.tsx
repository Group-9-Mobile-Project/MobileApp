import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import GraphContainer from '../components/Statistics/GraphContainer'
import TextStatistics from '../components/Statistics/TextStatistics'
import RecordedEventsList from '../components/Statistics/RecordedEventsList'
import { RouteFinal } from '../types/Workout'
import { listRouteFinals } from '../services/routeStorage'

export default function StatisticsScreen() {
  const [allRecordedEvents, setAllRecordedEvents] = useState<{eventId: string, final: RouteFinal}[]>([])

  useEffect(() => {
    const load = async () => {
      const results = await listRouteFinals()
      setAllRecordedEvents(results)
    };

    load();
  },[])

  return (
    <ScrollView>
      <GraphContainer RecordedEvents={allRecordedEvents} />

      <TextStatistics />

      <RecordedEventsList RecordedEvents={allRecordedEvents}  />
    </ScrollView>
  )
}