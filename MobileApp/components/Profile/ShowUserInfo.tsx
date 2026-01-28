import { StyleSheet, View, Text, Pressable } from 'react-native';
import { auth, firestore, USERINFO } from '../../firebase/Config';
import React, { useEffect, useState } from 'react';
import EditUserInfo from './EditUserInfo';
import { UserInfo } from '../../types/UserInfo';
import { doc, getDoc } from "firebase/firestore";
import { Card } from 'react-native-paper';

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

      <Card style={styles.cardContainer}>
        <Card.Content>
          <Text style={styles.heading} >Omat tapahtumat</Text>
        </Card.Content>
        <Card.Content>
          <Text style={styles.infoText}>Tähän tulee sitten käyttäjän omat tapahtumat.</Text>
        </Card.Content>
      </Card>

      <Card style={styles.cardContainer}>
        <Card.Content>
          <Text style={styles.heading} >Omat tiedot</Text>
        </Card.Content>
        <Card.Content>
          {userInfo ? <View>
            <Text style={styles.infoText}>Nimi: {userInfo.name}</Text>
            <Text style={styles.infoText}>Sähköposti: {userInfo.email}</Text>
            <Text style={styles.infoText}>Syntymäpäivä: {userInfo.birthdate}</Text>
            <Text style={styles.infoText}>Kaupunki: {userInfo.city}</Text>
            <Text style={styles.infoText}>Harrastukset: {userInfo.hobbies}</Text>
            <Text style={styles.infoText}>Kiinnostusten kohteet: {userInfo.interests}</Text>
            <Text style={styles.infoText}>Pronominit: {userInfo.pronouns}</Text>
          </View> : null}
        </Card.Content>
      </Card>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => pressed && styles.textPressed}
        accessibilityRole="button"
        accessibilityLabel="Show user info"
      >
        <Text style={styles.buttonText}>Muokkaa omia tietojasi</Text>
      </Pressable>

      {modalVisible && <EditUserInfo />}

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  cardContainer: {
    alignContent: 'flex-start',
    marginBlockStart: 20,
    width: '100%',
    backgroundColor: 'lightgrey',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  },
  textPressed: {
    opacity: 0.6
  },
  infoText: {
    fontSize: 12,
    padding: 5,
    fontWeight: 'bold'
  }
});