import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { View, Text, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { auth, firestore, setDoc, USERINFO } from "../../firebase/Config";
import { doc, serverTimestamp } from "firebase/firestore";

export default function RegisterForm() {

    const passwordRef = useRef<TextInput>(null);
    const passwordAgainRef = useRef<TextInput>(null);
    const nameRef = useRef<TextInput>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(false);


    async function handleFirebaseAdd(): Promise<void> {

        try {
            await setDoc(doc(firestore, USERINFO, email), {
                name: displayName,
                email: email,
                birthdate: "",
                description: "",
                hobbies: [],
                interests: "",
                city: "",
                joined: serverTimestamp(),
                pronouns: "",
            });
        } catch (err) {
            console.error('Failed to save user info', err);
        }
    }

    const handleRegister = async () => {

        if (!email || !password || !passwordAgain || !displayName) {
            Alert.alert('Virhe', 'Täytä kaikki kentät');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Virhe', 'Salasanan tulee olla vähintään 8 merkkiä');
            return;
        }

        if (password !== passwordAgain) {
            Alert.alert('Virhe', 'Salasanat eivät täsmää')
            return;
        }

        setLoading(true);
        try {
            createUserWithEmailAndPassword(auth, email, password)
                .then((res) => {
                    const user = res.user;
                    updateProfile(user, {
                        displayName: displayName
                    })
                        .then(() => {
                            console.log(user)
                        })

                })
                .then(() => {
                    handleFirebaseAdd()
                })
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
                Anna sähköpostiosoitteesi ja salasanasi. Toista salasana, ja lisää vielä käyttäjänimesi rekisteröityäksesi tähän sovellukseen
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
                autoCapitalize="none"
                returnKeyType='next'
                submitBehavior="submit"
                onSubmitEditing={() => passwordAgainRef.current?.focus()}
            />

            <TextInput style={styles.input}
                ref={passwordAgainRef}
                value={passwordAgain}
                onChangeText={setPasswordAgain}
                placeholder="Salasana uudelleen"
                secureTextEntry
                autoCapitalize="none"
                returnKeyType='next'
                submitBehavior="submit"
                onSubmitEditing={() => nameRef.current?.focus()}
            />

            <TextInput style={styles.input}
                ref={nameRef}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Käyttäjänimi"
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