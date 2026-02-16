import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useRef, useState } from 'react'
import { auth, firestore, setDoc, USERINFO } from "../../firebase/Config";
import { doc, serverTimestamp } from "firebase/firestore";
import { Colors } from "../../constants/colors";
import globalStyles from "../../themes/GlobalStyles";

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
      Alert.alert("Virhe", "Salasanan tulee olla vähintään 8 merkkiä");
      return;
    }

    if (password !== passwordAgain) {
      Alert.alert("Virhe", "Salasanat eivät täsmää");
      return;
    }
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });
      handleFirebaseAdd();
      Alert.alert("Käyttäjän luonti onnistui");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Virhe", "Sähköposti on jo käytössä");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Virhe", "Sähköpostiosoite on virheellinen");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Virhe", "Salasana on liian heikko");
      } else {
        Alert.alert("Virhe", error.message || "Rekisteröinti epäonnistui");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.registerContainer}>
      <Text style={globalStyles.subtitle}>Luo käyttäjä</Text>

      <Text style={globalStyles.registerText}>
        Anna sähköpostiosoitteesi ja salasanasi. Toista salasana, ja lisää vielä
        käyttäjänimesi rekisteröityäksesi tähän sovellukseen
      </Text>

      <TextInput
        style={globalStyles.registerInput}
        value={email}
        onChangeText={setEmail}
        placeholder="erkki@esimerkki.com"
        placeholderTextColor={Colors.dark.surface}
        keyboardType="email-address"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <TextInput
        style={globalStyles.registerInput}
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        placeholderTextColor={Colors.dark.surface}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordAgainRef.current?.focus()}
      />

      <TextInput
        style={globalStyles.registerInput}
        ref={passwordAgainRef}
        value={passwordAgain}
        onChangeText={setPasswordAgain}
        placeholder="Salasana uudelleen"
        placeholderTextColor={Colors.dark.surface}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => nameRef.current?.focus()}
      />

      <TextInput
        style={globalStyles.registerInput}
        ref={nameRef}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Käyttäjänimi"
        placeholderTextColor={Colors.dark.surface}
        returnKeyType="done"
      />

      <Button title="Luo käyttäjä" onPress={handleRegister} />

      {loading && <ActivityIndicator size="large" />}
    </View>
  );
}
