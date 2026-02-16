import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/Config';
import { Colors } from '../../constants/colors';
import globalStyles from '../../themes/GlobalStyles';


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
    <View style={globalStyles.registerContainer}>
      <Text style={globalStyles.subtitle}>Kirjaudu</Text>
      <Text style={globalStyles.registerText}>
        Anna sähköpostiosoitteesi ja salasanasi kirjautuaksesi tähän sovellukseen
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
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.registerInput}
        ref={passwordRef}
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        placeholderTextColor={Colors.dark.surface}
        secureTextEntry
        returnKeyType='done'
      />

      <Button title="Kirjaudu" onPress={handleLogin} />

      {loading && <ActivityIndicator size="large" />}
    </View>
  );
}