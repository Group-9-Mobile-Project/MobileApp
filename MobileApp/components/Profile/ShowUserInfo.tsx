import { StyleSheet, View, Text, Pressable } from 'react-native';
import { auth, firestore, USERINFO } from '../../firebase/Config';
import React, { useEffect, useState } from 'react';
import EditUserInfo from './EditUserInfo';
import { UserInfo } from '../../types/UserInfo';
import { doc, getDoc } from "firebase/firestore";

export default function ShowUserInfo() {

  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const profile = auth.currentUser;
      //if (profile?.email) setEmail(profile.email);
      const profileEmail = profile?.email;
      if (!profileEmail) return;

      setEmail(profileEmail);

      const docRef = doc(firestore, USERINFO, profileEmail);
      //console.log('doc path:', docRef.path);

      try {
        const docSnap = await getDoc(docRef);
        //console.log('exists:', docSnap.exists());
        //console.log('data:', docSnap.data())

        if (docSnap.exists()) {
          setUserInfo(docSnap.data({ serverTimestamps: 'estimate' }) as UserInfo);
          //console.log("Kissa", docSnap.data())
        } else {
          console.log("User info not found")
        }

      } catch (e) {
        console.log('getDoc error', e)
      }

    })();
  }, []);

  return (
    <View style={styles.container}>

      {userInfo ? <View style={styles.info}>
        <Text style={styles.heading} >Omat tiedot</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  triggerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    margin: 20,
  },
  textPressed: {
    opacity: 0.6,
  },
  info: {
    borderColor: 'lightgray',
    borderWidth: 4,
    padding: 10,
  },
});