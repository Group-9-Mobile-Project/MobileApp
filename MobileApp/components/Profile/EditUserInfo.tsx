import { View, Text, TextInput, TouchableOpacity, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { auth, firestore, USERINFO } from '../../firebase/Config'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../../context/AuthContext';
import globalStyles from '../../themes/GlobalStyles';
import DateTimePickerField from '../Common/DateTimePickerField';

export default function EditUserInfo({ onClose }: { onClose: () => void }) {

  const { user } = useAuth()
  const [email, setEmail] = useState("");
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [birthdate, setBirthdate] = useState<Date | null>(null)
  const [city, setCity] = useState("")
  const [hobbies, setHobbies] = useState<string[]>([])
  const [hobbyInput, setHobbyInput] = useState("")
  const [interests, setInterests] = useState("")
  const [pronouns, setPronouns] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    (async () => {

      const profileEmail = user?.email?.trim().toLowerCase() ?? null
      if (!profileEmail) return;

      setEmail(profileEmail);

      const docRef = doc(firestore, USERINFO, profileEmail);

      try {
        const docSnap = await getDoc(docRef)
        if ((docSnap).exists()) {
          setName(docSnap.data().name || "")
          setDescription(docSnap.data().description || "")
          const bd = docSnap.data().birthdate
          if (bd) {
            if (bd.includes('.')) {
              const [d, m, y] = bd.split('.').map(Number)
              setBirthdate(new Date(y, m - 1, d))
            } else {
              setBirthdate(new Date(bd))
            }
          } else {
            setBirthdate(null)
          }
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

  const formatDate = (date: Date) => {
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    return `${d}.${m}.${y}`
  }

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
        birthdate: birthdate ? formatDate(birthdate) : "",
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
        <View style={globalStyles.editUserContainer}>
          <Text style={globalStyles.heading} >Muokkaa omia tietoja</Text>
          <Text style={globalStyles.label}>Nimi:</Text>
          <TextInput style={globalStyles.input}
            placeholder='Syötä nimesi'
            value={name}
            onChangeText={setName}
            editable={!loading}
          />
          <Text style={globalStyles.label}>Kuvaus:</Text>
          <TextInput style={globalStyles.input}
            placeholder='Syötä Kuvaus'
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />
          <DateTimePickerField
            label="Syntymäpäivä:"
            labelStyle={globalStyles.label}
            value={birthdate ?? new Date()}
            mode="date"
            onChange={setBirthdate}
            buttonLabel={birthdate ? formatDate(birthdate) : 'Valitse syntymäpäivä'}
            maximumDate={new Date()}
          />
          <Text style={globalStyles.label}>Kaupunki:</Text>
          <TextInput style={globalStyles.input}
            placeholder='Syötä kaupunkisi'
            value={city}
            onChangeText={setCity}
            editable={!loading}
          />
          <Text style={globalStyles.label}>Harrastukset:</Text>
          <View style={globalStyles.hobbyInputContainer}>
            <TextInput style={globalStyles.hobbyInput}
              placeholder='Lisää harrastus'
              value={hobbyInput}
              onChangeText={setHobbyInput}
              editable={!loading}
            />
            <TouchableOpacity style={globalStyles.addButton} onPress={addHobby}>
              <Text style={globalStyles.subHeading}>+</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            scrollEnabled={false}
            data={hobbies}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={globalStyles.hobbyItem}>
                <Text style={globalStyles.hobbyText}>{item}</Text>
                <TouchableOpacity
                  style={globalStyles.deleteButton}
                  onPress={() => removeHobby(index)}
                >
                  <Text style={globalStyles.deleteButtonText}>x</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={globalStyles.label}>Kiinnostusten kohteet:</Text>
          <TextInput style={globalStyles.input}
            placeholder='Syötä kiinnostusten kohteet'
            value={interests}
            onChangeText={setInterests}
            editable={!loading}
          />
          <Text style={globalStyles.label}>Pronominit:</Text>
          <TextInput style={globalStyles.input}
            placeholder='Syötä pronominit'
            value={pronouns}
            onChangeText={setPronouns}
            editable={!loading}
          />
        </View>


        <TouchableOpacity style={[globalStyles.buttonSave, loading && globalStyles.buttonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text>
            {loading ? "Tallennetaan..." : "Tallenna muutokset"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.buttonCancel}
          onPress={onClose}
        >
          <Text>Peruuta</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  )
}