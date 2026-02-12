import React, { useState } from 'react'
import ExpandableListCard from '../Common/ExpandableListCard'

interface AttendeesProps {
    attendees: string[]
}

export default function EventAttendees({ attendees }: AttendeesProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    /*
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
        */
    return (
        <ExpandableListCard
            title='Ilmoittautuneet käyttäjät'
            listType={'attendees'}
            list={attendees}        
        />
    )
}