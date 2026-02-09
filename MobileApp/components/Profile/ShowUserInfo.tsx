import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { auth, firestore, USERINFO } from '../../firebase/Config';
import React, { useEffect, useState } from 'react';
import EditUserInfo from './EditUserInfo';
import { UserInfo } from '../../types/UserInfo';
import { doc, getDoc } from "firebase/firestore";
import { Card } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import globalStyles from '../../themes/GlobalStyles';

export default function ShowUserInfo() {

  const { user } = useAuth()

  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState("");

  const fetchUserInfo = async () => {
    const profileEmail = user?.email?.trim().toLowerCase() ?? null
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
    <View style={globalStyles.modalView}>
      <Card style={globalStyles.showUserContainer}>
        <ScrollView nestedScrollEnabled={true}>
          <Card.Content>
            <Text style={globalStyles.heading} >Omat tiedot</Text>
          </Card.Content>
          <Card.Content>
            {userInfo ? <View>
              <Text style={globalStyles.infoText}>Nimi: {userInfo.name}</Text>
              <Text style={globalStyles.infoText}>Sähköposti: {userInfo.email}</Text>
              <Text style={globalStyles.infoText}>Kuvaus: {userInfo.description}</Text>
              <Text style={globalStyles.infoText}>Syntymäpäivä: {userInfo.birthdate}</Text>
              <Text style={globalStyles.infoText}>Kaupunki: {userInfo.city}</Text>
              <Text style={globalStyles.infoText}>Harrastukset:</Text>
              <View style={globalStyles.hobbiesTable}>
                {userInfo.hobbies && userInfo.hobbies.length > 0 ? (
                  userInfo.hobbies.map((hobby, index) => (
                    <View key={index} style={globalStyles.hobbyRow}>
                      <Text style={globalStyles.hobbyText}>{hobby}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={globalStyles.infoText}>Ei harrastuksia lisätty</Text>
                )}
              </View>
              <Text style={globalStyles.infoText}>Kiinnostusten kohteet: {userInfo.interests}</Text>
              <Text style={globalStyles.infoText}>Pronominit: {userInfo.pronouns}</Text>
            </View> : null}
          </Card.Content>
        </ScrollView>
      </Card>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => pressed && globalStyles.textPressed}
        accessibilityRole="button"
        accessibilityLabel="Show user info"
      >
        <Text style={globalStyles.buttonText}>Muokkaa omia tietojasi</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <EditUserInfo
          onClose={() => {
            setModalVisible(false);
            fetchUserInfo();
          }}
        />
      </Modal>
    </View>
  )
}