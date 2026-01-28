import { Button, Alert } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/Config';

    export default function LogOutButton() {
      const { onLogout } = useAuth();
    
      const handleLogOut = () => {
        Alert.alert(
          'Kirjaudu ulos', 'Haluatko varmasti kirjautua ulos?',
          [
            { text: 'Peruuta', style: 'cancel' },
            {
              text: 'Kyllä',
              style: 'destructive',
              onPress: async () => {
                await signOut(auth);
                onLogout();
              }
            },
          ]
        );
      };

    return (

        <Button
            title='Kirjaudu ulos'
            onPress={handleLogOut}
        />

    )
}