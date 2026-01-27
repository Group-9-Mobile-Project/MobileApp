import { StyleSheet, View, Text, Pressable } from 'react-native';
import { firestore, USERINFO } from '../../firebase/Config';
import React, { useEffect, useState } from 'react';
import EditUserInfo from './EditUserInfo';
import { UserInfo } from '../../types/UserInfo';
import { doc, getDoc } from "firebase/firestore";
import { useProfile } from '../../hooks/useProfile';

export default function ShowUserInfo() {

  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState("");
  const { getProfile } = useProfile();

  useEffect(() => {
    (async () => {
      const profile = await getProfile();
      //if (profile?.email) setEmail(profile.email);
      const profileEmail = profile?.email;
      if (!profileEmail) return;

      setEmail(profileEmail);

      const docRef = doc(firestore, USERINFO, profileEmail);
      //console.log('doc path:', docRef.path);

      try {
        const docSnap = await getDoc(docRef);
        console.log('exists:', docSnap.exists());
        console.log('data:', docSnap.data())

        if (docSnap.exists()) {
          setUserInfo(docSnap.data({ serverTimestamps: 'estimate' }) as UserInfo);
          console.log("Kissa", docSnap.data())
        } else {
          console.log("User info not found")
        }

      } catch (e) {
        console.log('getDoc error', e)
      }

    })();
  }, [getProfile]);

  return (
    <View>
      <Text style={styles.heading} >Omat tiedot</Text>

        {userInfo ? <View style={styles.text}>
          <Text>Nimi: {userInfo.name}</Text>
          <Text>Sähköposti: {userInfo.email}</Text>
          <Text>Syntymäpäivä: {userInfo.birthdate}</Text>
          <Text>Kaupunki: {userInfo.city}</Text>
          <Text>Harrastukset: {userInfo.hobbies}</Text>
          <Text>Kiinnostusten kohteet: {userInfo.interests}</Text>
          <Text>Pronominit: {userInfo.pronouns}</Text>
        </View> : null}

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => pressed && styles.textPressed}
        accessibilityRole="button"
        accessibilityLabel="Show user info"
      >
        <Text style={styles.triggerText}>Muokkaa omia tietojasi</Text>
      </Pressable>

      {modalVisible && <EditUserInfo />}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerText: {
    color: 'black',
    fontSize: 16,
  },
  textPressed: {
    opacity: 0.6,
  },
  text: {
    justifyContent: 'center',
    alignContent: 'center'
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});