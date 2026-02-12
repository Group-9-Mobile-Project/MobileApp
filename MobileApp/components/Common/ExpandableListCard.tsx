import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Divider } from 'react-native-paper'
import AttendeeInfoRow from '../EventInfo/AttendeeInfoRow'
import { Event } from '../../types/Event'
import SingleEventRow from './SingleEventRow'
import globalStyles from '../../themes/GlobalStyles'

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
    <Card style={globalStyles.cardContainer}>
      <Card.Content style={globalStyles.expandableHeader} onTouchEnd={() => setIsExpanded(!isExpanded)}>
        <Text style={globalStyles.heading}>{title}</Text>
        {isExpanded ? <Text style={globalStyles.heading}>▲</Text> : <Text style={globalStyles.heading}>▼</Text>}
      </Card.Content>
      {isExpanded && (
        <View>
          <Divider />

          {(listType == 'attendees') && (

            <Card.Content style={globalStyles.basicInfoView}>
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

                <Card.Content style={globalStyles.basicInfoView}>
                  {
                    itemList.map((event, index) => (
                      <SingleEventRow event={event as Event} key={index} />
                    ))
                  }
                </Card.Content>

                :
                <Card.Content style={globalStyles.basicInfoView}>
                  <Text style={globalStyles.noEventsText}>Ei tapahtumia</Text>
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