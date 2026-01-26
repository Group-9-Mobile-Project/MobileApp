import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { auth } from "../../firebase/Config";

export default function RegisterForm() {
    const passwordRef = useRef<TextInput>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {

        if (!email || !password) {
            Alert.alert('Virhe', 'Täytä kaikki kentät');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Virhe', 'Salasanan tulee olla vähintään 8 merkkiä');
            return;
        }

        setLoading(true);
        try {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    // Signed up 
                    Alert.alert('Käyttäjän luonti onnistui')
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        } catch (error: any) {
            Alert.alert('Virhe', error.message || 'Rekisteröinti epäonnistui')
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>

            <Text style={styles.subtitle}>
                Luo käyttäjä
            </Text>

            <Text style={styles.text}>
                Anna sähköpostiosoitteesi ja luo salasana rekisteröityäksesi tähän sovellukseen
            </Text>

            <TextInput style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="erkki@esimerkki.com"
                keyboardType="email-address"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <TextInput style={styles.input}
                ref={passwordRef}
                value={password}
                onChangeText={setPassword}
                placeholder="********"
                secureTextEntry
                returnKeyType='done'
            
            />

            <Button
                title="Luo käyttäjä"
                onPress={handleRegister}
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