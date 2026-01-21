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

                    <View style={styles.registerButton}>
                        <Text style={styles.text}>
                            Eikö sinulla ole vielä käyttäjää?
                        </Text>
                        <Button
                            title="Rekisteröidy"
                            onPress={() => setShowLogin(false)}
                        />
                    </View>
                </>
            ) : (
                <>
                    <RegisterForm />

                    <View style={styles.loginButton}>
                        <Text style={styles.text}>
                            Onko sinulla jo käyttäjä?
                        </Text>

                        <Button
                            title="Kirjaudu"
                            onPress={() => setShowLogin(true)}
                        />
                    </View>
                </>)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    loginButton: {
        marginBottom: 50,
    },
    registerButton: {
        marginBottom: 50,
    }
})

