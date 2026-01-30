import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Event } from '../../types/Event'
import { Modal } from 'react-native'

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
                <Text style={styles.heading}>{event.title}</Text>
                <View style={styles.basicInfoView}>
                    <Text>Aika: {event.startTime + ' - ' + event.endTime}</Text>
                    <Text>Paikka: {event.location.address}</Text>
                    <Text>Tyyppi: {event.type}</Text>
                    <Text>Tapahtuman lisääjä: {event.organizer}</Text>
                    <Text>Ilmoittautuneita: {event.attendees.length}</Text>
                </View>
                <View style={styles.descriptionView}>
                    <Text>Kuvaus:</Text>
                    <Text>{event.description}</Text>
                </View>
                <View style={styles.pressableView}>
                    <Pressable
                    style={styles.button}
                    onPress={() => setShowModal(!showModal)}>
                        <Text>Sulje</Text>
                    </Pressable>
                    <Pressable style={styles.button}>
                        <Text>Ilmoittaudu EI TEE MITÄÄN</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>



    )
}

const styles = StyleSheet.create({
    modalView: {
        marginVertical: 30,
        backgroundColor: 'white',
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',

        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        gap: 24,
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 24,
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
})