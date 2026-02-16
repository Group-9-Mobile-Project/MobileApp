import { View, Text, Button,TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LoginForm from "../components/Register/LoginForm";
import RegisterForm from "../components/Register/RegisterForm";
import { Colors } from '../constants/colors';
import { LinearGradient } from 'expo-linear-gradient'
import globalStyles from '../themes/GlobalStyles';

export default function RegisterScreen() {

    const [showLogin, setShowLogin] = useState(true)

    return (
        <LinearGradient colors={[Colors.dark.background, Colors.dark.onPrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
         <KeyboardAwareScrollView
                style={globalStyles.container}
                contentContainerStyle={globalStyles.container}
                keyboardShouldPersistTaps="handled"
              //  enableOnAndroid 
                extraScrollHeight={24}
            >

                <Text style={globalStyles.header}>
                    Liikkeelle
                </Text>

                {showLogin ? (
                    <>
                        <LoginForm />

                        <View style={globalStyles.changeModeView}>
                            <Text style={globalStyles.label}>
                                Eikö sinulla ole vielä käyttäjää?
                            </Text>
                            <View style={globalStyles.changeModeButton}>
                                <Button
                                    title="Rekisteröidy"
                                    onPress={() => setShowLogin(false)}
                                />
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        <RegisterForm />

                        <View style={globalStyles.changeModeView}>
                            <Text style={globalStyles.label}>
                                Onko sinulla jo käyttäjä?
                            </Text>
                            <View style={globalStyles.changeModeButton}>
                                <Button
                                    title="Kirjaudu"
                                    onPress={() => setShowLogin(true)}
                                />
                            </View>
                        </View>
                    </>)}
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback >
        </LinearGradient>
    )
}
