import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Divider } from 'react-native-paper'
import AttendeeInfoRow from '../EventInfo/AttendeeInfoRow'
import { Event } from '../../types/Event'
import SingleEventRow from './SingleEventRow'

interface ExpandableListCardProps {
  listType: "events" | "attendees",
  list: Event[] | string[],
  title: string
}

export default function ExpandableListCard({ listType, list, title }: ExpandableListCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [itemList, setItemList] = useState<Event[] | string[]>([])

  useEffect(() => {
    setItemList(list)
  }, [list])

  return (
    <Card style={styles.cardContainer}>
      <Card.Content style={styles.expandableHeader} onTouchEnd={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.heading}>{title}</Text>
        {isExpanded ? <Text style={styles.heading}>▲</Text> : <Text style={styles.heading}>▼</Text>}
      </Card.Content>
      {isExpanded && (
        <View>
          <Divider />

          {(listType == 'attendees') && (

            <Card.Content style={styles.basicInfoView}>
              {
                itemList.map((attendee) => (
                  <AttendeeInfoRow email={attendee.toString()} key={attendee.toString()} />
                ))
              }
            </Card.Content>
          )
          }

          {(listType == 'events') && (
            <View>
              {(itemList[0]) ?

                <Card.Content style={styles.basicInfoView}>
                  {
                    itemList.map((event, index) => (
                      <SingleEventRow event={event as Event} key={index} />
                    ))
                  }
                </Card.Content>

                :
                <Card.Content style={styles.basicInfoView}>
                  <Text style={styles.noEventsText}>Ei tapahtumia</Text>
                </Card.Content>
              }

            </View>)
          }


        </View>
      )
      }

    </Card>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    alignContent: 'flex-start',
    marginBlockStart: 20,
    width: '100%',
    backgroundColor: 'lightgrey',
    marginBlockEnd: 10
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  basicInfoView: {
    margin: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
  },
  noEventsText: {
    fontSize: 16,
    fontStyle: 'italic'
  }
})