import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { auth, firestore, USERINFO } from '../../firebase/Config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function EditUserInfo({ onClose }: { onClose: () => void }) {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [city, setCity] = useState("")
  const [hobbies, setHobbies] = useState<string[]>([])
  const [hobbyInput, setHobbyInput] = useState("")
  const [interests, setInterests] = useState("")
  const [pronouns, setPronouns] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    (async () => {

      const profile = auth.currentUser;
      const profileEmail = profile?.email;
      if (!profileEmail) return;

      setEmail(profileEmail);

      const docRef = doc(firestore, USERINFO, profileEmail);

      try {
        const docSnap = await getDoc(docRef)
        if ((docSnap).exists()) {
          setName(docSnap.data().name || "")
          setDescription(docSnap.data().description || "")
          setBirthdate(docSnap.data().birthdate || "")
          setCity(docSnap.data().city || "")
          setHobbies(docSnap.data().hobbies || [])
          setInterests(docSnap.data().interests || "")
          setPronouns(docSnap.data().pronouns || "")
        }
      } catch (e) {
        console.log('getDoc error', e)
      }
    })()
  }, [])

  const addHobby = () => {
    if (hobbyInput.trim()) {
      setHobbies([...hobbies, hobbyInput.trim()])
      setHobbyInput("")
    }
  }

  const removeHobby = (index: number) => {
    setHobbies(hobbies.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!email) return

    setLoading(true)
    const docRef = doc(firestore, USERINFO, email)

    try {
      await updateDoc(docRef, {
        name: name,
        description: description,
        birthdate: birthdate,
        city: city,
        hobbies: hobbies,
        interests: interests,
        pronouns: pronouns
      })
      alert("Päivitys onnistui")
      onClose()
    } catch (e) {
      console.log('updateDoc error', e)
      alert("Virhe päivityksessä")
    } finally {
      setLoading(false)
    }
  }

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        //  enableOnAndroid 
        extraScrollHeight={24}
      >
        <Text style={styles.heading} >Muokkaa omia tietoja</Text>
        <View style={styles.container}>
          <Text style={styles.label}>Nimi:</Text>
          <TextInput style={styles.input}
            placeholder='Syötä nimesi'
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <Text style={styles.label}>Kuvaus:</Text>
          <TextInput style={styles.input}
            placeholder='Syötä Kuvaus'
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />
          <Text style={styles.label}>Syntymäpäivä:</Text>
          <TextInput style={styles.input}
            placeholder='PP/KK/VVVV'
            value={birthdate}
            onChangeText={setBirthdate}
            editable={!loading}
          />
          <Text style={styles.label}>Kaupunki:</Text>
          <TextInput style={styles.input}
            placeholder='Syötä kaupunkisi'
            value={city}
            onChangeText={setCity}
            editable={!loading}
          />
          <Text style={styles.label}>Harrastukset:</Text>
          <View style={styles.hobbyInputContainer}>
            <TextInput style={styles.hobbyInput}
              placeholder='Lisää harrastus'
              value={hobbyInput}
              onChangeText={setHobbyInput}
              editable={!loading}
            />
            <TouchableOpacity style={styles.addButton} onPress={addHobby}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={hobbies}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.hobbyItem}>
                <Text style={styles.hobbyText}>{item}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeHobby(index)}
                >
                  <Text style={styles.deleteButtonText}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.label}>Kiinnostusten kohteet:</Text>
          <TextInput style={styles.input}
            placeholder='Syötä kiinnostusten kohteet'
            value={interests}
            onChangeText={setInterests}
            editable={!loading}
          />
          <Text style={styles.label}>Pronominit:</Text>
          <TextInput style={styles.input}
            placeholder='Syötä pronominit'
            value={pronouns}
            onChangeText={setPronouns}
            editable={!loading}
          />
        </View>


        <TouchableOpacity style={[styles.buttonSave, loading && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Tallennetaan..." : "Tallenna muutokset"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCancel}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Peruuta</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fieldContainer: {
    margin: 20,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    padding: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 14,
    marginTop: 5,
  },
  hobbyInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  hobbyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  hobbyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  hobbyText: {
    fontSize: 14,
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#ff3b30',
  },
  buttonSave: {
    backgroundColor: 'grey',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    margin: 10,
  },
  buttonCancel: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    margin: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {

  },
})