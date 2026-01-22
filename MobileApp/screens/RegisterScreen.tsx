import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import LoginForm from "../components/Register/LoginForm";
import RegisterForm from "../components/Register/RegisterForm";

export default function RegisterScreen() {

    const [showLogin, setShowLogin] = useState(true)

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Liikkeelle
            </Text>

            {showLogin ? (
                <>
                    <LoginForm />

                    <View style={styles.changeModeView}>
                        <Text style={styles.text}>
                            Eikö sinulla ole vielä käyttäjää?
                        </Text>
                        <View style={styles.changeModeButton}>
                            <Button
                                title="Rekisteröidy"
                                onPress={() => setShowLogin(false)}
                            />
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <RegisterForm />

                    <View style={styles.changeModeView}>
                        <Text style={styles.text}>
                            Onko sinulla jo käyttäjä?
                        </Text>
                        <View style={styles.changeModeButton}>
                            <Button
                                title="Kirjaudu"
                                onPress={() => setShowLogin(true)}
                            />
                        </View>
                    </View>
                </>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        marginTop: 50,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',

    },
    changeModeView: {
        margin: 8,
        marginBottom: 60,
        alignItems: 'center',
    },
    changeModeButton: {
        width: '50%' ,
        margin: 16,
    }
})

