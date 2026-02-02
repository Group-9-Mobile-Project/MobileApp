import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Event } from '../../types/Event'
import { Modal } from 'react-native'
import { Card } from 'react-native-paper'

interface EventInfoProps {
    showModal: boolean,
    setShowModal: Function,
    event: Event
}

export default function EventInfoModal({ showModal, setShowModal, event }: EventInfoProps) {
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
                        <Text style={styles.heading}>{event.title}</Text>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.basicInfoView}>
                            <Text style={styles.infoText}>Aika: {event.startTime}</Text>
                            <Text style={styles.infoText}>Paikka: {event.location.address}</Text>
                            <Text style={styles.infoText}>Tyyppi: {event.type}</Text>
                            <Text style={styles.infoText}>Tapahtuman lisääjä: {event.organizer}</Text>
                            <Text style={styles.infoText}>Ilmoittautuneita: {event.attendees.length}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.descriptionView}>
                            <Text style={styles.infoText}>Kuvaus:</Text>
                            <Text style={styles.infoText}>{event.description}</Text>
                        </View>
                    </Card.Content>
                    <Card.Content>
                        <View style={styles.pressableView}>
                            <Pressable
                                style={({ pressed }) => pressed && styles.textPressed}
                                onPress={() => setShowModal(!showModal)}>
                                <Text style={styles.buttonText}>Sulje</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => pressed && styles.textPressed}>
                                <Text style={styles.buttonText}>Ilmoittaudu EI TEE MITÄÄN</Text>
                            </Pressable>
                        </View>
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