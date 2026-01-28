import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/Config';

export default function LoginForm() {
  const passwordRef = useRef<TextInput>(null);
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
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Kirjautuminen onnistui');
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        Alert.alert('Liian monta yritystä', 'Yritä uudelleen myöhemmin');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Virhe', 'Virheellinen sähköposti tai salasana');
      } else {
        Alert.alert('Virhe', 'Kirjautuminen epäonnistui');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Kirjaudu</Text>
      <Text style={styles.text}>
        Anna sähköpostiosoitteesi ja salasanasi kirjautuaksesi tähän sovellukseen
      </Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="erkki@esimerkki.com"
        keyboardType="email-address"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
        returnKeyType='done'
      />

      <Button title="Kirjaudu" onPress={handleLogin} />

      {loading && <ActivityIndicator size="large" />}
    </View>
  );
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
