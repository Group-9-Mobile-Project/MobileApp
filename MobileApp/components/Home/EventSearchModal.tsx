import { View, Text, Button, Modal, StyleSheet } from 'react-native'
import React, { useState } from 'react'


export default function EventSearchModal() {
    const [showModal, setShowModal] = useState(false)

    return (
        <View>
            <Button
                title='Etsi Tapahtumia'
                onPress={() => setShowModal(true)}
            />

            <Modal
                animationType='slide'
                visible={showModal}
                onRequestClose={() => setShowModal(!showModal)}
            >
                <View>
                    <Text>Tämä on tapahtumien hakukenttä</Text>
                </View>
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    }
})