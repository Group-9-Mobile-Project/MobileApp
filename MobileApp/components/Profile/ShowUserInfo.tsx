import { StyleSheet, View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { auth, firestore, USERINFO } from '../../firebase/Config';
import React, { useEffect, useState } from 'react';
import EditUserInfo from './EditUserInfo';
import { UserInfo } from '../../types/UserInfo';
import { doc, getDoc } from "firebase/firestore";
import { Card } from 'react-native-paper';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';

export default function ShowUserInfo() {

  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState("");

  const fetchUserInfo = async () => {
    const profile = auth.currentUser;
    const profileEmail = profile?.email;
    if (!profileEmail) return;

    setEmail(profileEmail);
    const docRef = doc(firestore, USERINFO, profileEmail);

    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data({ serverTimestamps: 'estimate' }) as UserInfo);
      } else {
        console.log("User info not found")
      }
    } catch (e) {
      console.log('getDoc error', e)
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);


  return (
    <View style={styles.container}>
      <Card style={styles.cardContainer}>
        <ScrollView nestedScrollEnabled={true}>
          <Card.Content>
            <Text style={styles.heading} >Omat tiedot</Text>
          </Card.Content>
          <Card.Content>
            {userInfo ? <View>
              <Text style={styles.infoText}>Nimi: {userInfo.name}</Text>
              <Text style={styles.infoText}>Sähköposti: {userInfo.email}</Text>
              <Text style={styles.infoText}>Kuvaus: {userInfo.description}</Text>
              <Text style={styles.infoText}>Syntymäpäivä: {userInfo.birthdate}</Text>
              <Text style={styles.infoText}>Kaupunki: {userInfo.city}</Text>
              <Text style={styles.infoText}>Harrastukset:</Text>
              <View style={styles.hobbiesTable}>
                {userInfo.hobbies && userInfo.hobbies.length > 0 ? (
                  userInfo.hobbies.map((hobby, index) => (
                    <View key={index} style={styles.hobbyRow}>
                      <Text style={styles.hobbyText}>{hobby}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.infoText}>Ei harrastuksia lisätty</Text>
                )}
              </View>
              <Text style={styles.infoText}>Kiinnostusten kohteet: {userInfo.interests}</Text>
              <Text style={styles.infoText}>Pronominit: {userInfo.pronouns}</Text>
            </View> : null}
          </Card.Content>
        </ScrollView>
      </Card>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => pressed && styles.textPressed}
        accessibilityRole="button"
        accessibilityLabel="Show user info"
      >
        <Text style={styles.EditButtonText}>Muokkaa omia tietojasi</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <EditUserInfo
          onClose={() => {
            setModalVisible(false);
            fetchUserInfo(); // Päivitä tiedot kun modal suljetaan
          }}
        />
      </Modal>
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
    marginBlockStart: 10,
    width: '100%',
    backgroundColor: 'lightgrey',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  buttonText: {
    backgroundColor: 'lightgrey',
    fontWeight: 'bold',
    alignItems: 'center',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
  },
  EditButtonText: {
    backgroundColor: 'lightgrey',
    padding: 12,
    marginVertical: 10,
    borderRadius: 10,
    textAlign: 'center'
  },
  textPressed: {
    opacity: 0.6
  },
  infoText: {
    fontSize: 12,
    padding: 5,
  },
    hobbiesTable: {
    marginVertical: 5,
  },
  hobbyRow: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    backgroundColor: '#b5b5b5',
  },
  hobbyText: {
    fontSize: 13,
    color: '#333',
  },
});