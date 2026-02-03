import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Divider } from 'react-native-paper'
import { EventProps } from '../../types/Event'
import AttendeeInfoRow from './AttendeeInfoRow'

interface AttendeesProps {
    attendees: string[]
}

export default function EventAttendees({ attendees }: AttendeesProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    useEffect(() => {
        setIsExpanded(false)
    }, [])

    return (
        <Card style={styles.cardContainer} >
            <Card.Content style={styles.expandableHeader} onTouchEnd={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.heading}>Ilmoittautuneet käyttäjät</Text>
                {isExpanded ? <Text style={styles.heading}>▲</Text> : <Text style={styles.heading}>▼</Text>}
            </Card.Content>
            {isExpanded && (
                <View>
                    <Divider />
                    <Card.Content style={styles.basicInfoView}>
                        {attendees.map((attendee) => (
                            <AttendeeInfoRow email={attendee} key={attendee.toString()}/>
                        ))}
                    </Card.Content>
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
        margin: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '95%',
    },
})