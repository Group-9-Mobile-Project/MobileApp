import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import GraphContainer from '../components/Statistics/GraphContainer'
import TextStatistics from '../components/Statistics/TextStatistics'
import RecordedEventsList from '../components/Statistics/RecordedEventsList'

export default function StatisticsScreen() {
  return (
    <ScrollView>
        <GraphContainer/>

        <TextStatistics />

        <RecordedEventsList />
    </ScrollView>
  )
}