import { View, Text, Modal, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { UserInfo } from '../../types/UserInfo'
import { Card } from 'react-native-paper'
import { Timestamp } from 'firebase/firestore'

interface AttendeeFullInfoProps {
    showModal: boolean,
    setShowModal: Function,
    attendee: UserInfo
}

export default function AttendeeInfoModal({ showModal, setShowModal, attendee }: AttendeeFullInfoProps) {
    const created = attendee.joined as unknown as Timestamp

    const time = created ? new Date(created.toDate()).toISOString().slice(0, 10) : 'unknown';

    return (

        <Modal
            animationType='slide'
            visible={showModal}
            onRequestClose={() => setShowModal(!showModal)}
            backdropColor={'#ffffff83'}
        >
            <View style={styles.modalView}>
                <Card style={styles.cardContainer}>
                    <Card.Content>
                        <Text style={styles.heading}>{attendee.name}</Text>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.basicInfoView}>
                            {attendee.birthdate && <Text style={styles.infoText}>Syntymäaika: {attendee.birthdate}</Text>}
                            {attendee.city && <Text style={styles.infoText}>Paikka: {attendee.city}</Text>}
                            {time && <Text style={styles.infoText}>Liittynyt: {time}</Text>}
                            {attendee.interests && <Text style={styles.infoText}>Kiinnostukset: {attendee.interests}</Text>}
                            {attendee.hobbies && <View>
                                <Text style={styles.infoText}>Harrastukset: </Text>
                                <View style={styles.descriptionView}>
                                    {attendee.hobbies.map((hobby) => (
                                        <Text style={styles.infoText} key={hobby}>{hobby}</Text>
                                    ))
                                    }
                                </View>
                            </View>
                            }

                            {attendee.pronouns && <Text style={styles.infoText}>Pronominit: {attendee.pronouns}</Text>}
                        </View>
                    </Card.Content>
                    <Card.Content>
                        {attendee.description &&
                            <View style={styles.descriptionView}>
                                <Text style={styles.infoText}>Kuvaus:</Text>
                                <Text style={styles.infoText}>{attendee.description}</Text>
                            </View>}
                    </Card.Content>
                    <Card.Content>
                        <Pressable
                            style={({ pressed }) => pressed && styles.textPressed}
                            onPress={() => setShowModal(!showModal)}>
                            <Text style={styles.buttonText}>Sulje</Text>
                        </Pressable>
                    </Card.Content>
                </Card>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24,
    },
    cardContainer: {
        alignContent: 'flex-start',
        marginBlockStart: 20,
        width: '100%',
        backgroundColor: 'lightgrey',
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
    descriptionView: {
        width: '95%',
        margin: 8
    },
    pressableView: {
        flexDirection: 'row',
        gap: 32
    },
    button: {
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        backgroundColor: 'lightblue',
        width: 'auto',
        padding: 10,
    },
    buttonText: {
        backgroundColor: 'lightgrey',
        fontWeight: 'bold',
        alignItems: 'center',
        padding: 12,
        marginVertical: 10,
        borderRadius: 10,
    },
    textPressed: {
        opacity: 0.6
    },
    infoText: {
        fontSize: 12,
        padding: 5,
    }

})
