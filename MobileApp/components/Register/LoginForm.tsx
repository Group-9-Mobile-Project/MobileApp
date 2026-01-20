import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/Config';

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        if (!email || !password) {
            Alert.alert('Virhe', 'Täytä kaikki kentät');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // Signed up 
                    Alert.alert('Kirjautuminen onnistui')
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    if (error.code === 'auth/too-many-requests') {
                        Alert.alert('Liian monta yritystä', 'Yritä uudelleen myöhemmin');
                    } else {
                        Alert.alert('Virhe', 'Kirjautuminen epäonnistui')
                    }
                    // ..
                });
        } catch (error: any) {
            Alert.alert('Virhe', 'Kirjautuminen epäonnistui')
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>

            <Text style={styles.subtitle}>
                Kirjaudu
            </Text>

            <Text style={styles.text}>
                Anna sähköpostiosoitteesi ja salasanasi kirjautuaksesi tähän sovellukseen
            </Text>

            <TextInput style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="erkki@esimerkki.com"
                keyboardType="email-address"
            />

            <TextInput style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                secureTextEntry
            />

            <Button
                title="Kirjaudu"
                onPress={handleLogin}
            />

            {loading && (
                <ActivityIndicator size="large" />
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '90%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        margin: 12,
        textAlign: 'center'
    },
});