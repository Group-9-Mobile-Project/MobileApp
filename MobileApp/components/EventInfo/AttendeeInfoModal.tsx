import { View, Text, Modal, Pressable } from "react-native";
import React from "react";
import { UserInfo } from "../../types/UserInfo";
import { Card } from "react-native-paper";
import { Timestamp } from "firebase/firestore";
import globalStyles from "../../themes/GlobalStyles";

interface AttendeeFullInfoProps {
  showModal: boolean;
  setShowModal: Function;
  attendee: UserInfo;
}

export default function AttendeeInfoModal({
  showModal,
  setShowModal,
  attendee,
}: AttendeeFullInfoProps) {
  const created = attendee.joined as unknown as Timestamp;

  const time = created
    ? new Date(created.toDate()).toISOString().slice(0, 10)
    : "unknown";

  return (
    <Modal
      animationType="fade"
      visible={showModal}
      onRequestClose={() => setShowModal(!showModal)}
      backdropColor={"#ffffff83"}
    >
      <View style={globalStyles.modalView}>
        <Card style={globalStyles.cardContainer}>
          <Card.Content>
            <Text style={globalStyles.heading}>{attendee.name}</Text>
          </Card.Content>
          <Card.Content>
            <View style={globalStyles.basicInfoView}>
              {attendee.birthdate && (
                <Text style={globalStyles.infoText}>
                  Syntymäaika: {attendee.birthdate}
                </Text>
              )}
              {attendee.city && (
                <Text style={globalStyles.infoText}>Paikka: {attendee.city}</Text>
              )}
              {time && <Text style={globalStyles.infoText}>Liittynyt: {time}</Text>}
              {attendee.interests && (
                <Text style={globalStyles.infoText}>
                  Kiinnostukset: {attendee.interests}
                </Text>
              )}
              {attendee.hobbies && (
                <View>
                  <Text style={globalStyles.infoText}>Harrastukset: </Text>
                  <View style={globalStyles.descriptionView}>
                    {attendee.hobbies.map((hobby) => (
                      <Text style={globalStyles.infoText} key={hobby}>
                        {hobby}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {attendee.pronouns && (
                <Text style={globalStyles.infoText}>
                  Pronominit: {attendee.pronouns}
                </Text>
              )}
            </View>
          </Card.Content>
          <Card.Content>
            {attendee.description && (
              <View style={globalStyles.descriptionView}>
                <Text style={globalStyles.infoText}>Kuvaus:</Text>
                <Text style={globalStyles.infoText}>{attendee.description}</Text>
              </View>
            )}
          </Card.Content>
          <Card.Content>
            <Pressable
              style={({ pressed }) => pressed && globalStyles.textPressed}
              onPress={() => setShowModal(!showModal)}
            >
              <Text style={globalStyles.buttonText}>Sulje</Text>
            </Pressable>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
}
