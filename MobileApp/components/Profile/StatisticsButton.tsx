import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '../../types/Navigation';

export default function StatisticsButton() {
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();

    return (
        <Pressable
        onPress={() => navigation.navigate('Tilastot')}
        style={({ pressed }) => pressed && {opacity: 0.6}}
        accessibilityRole="button"
        accessibilityLabel="Show user statistics">
            <Text style={{
                backgroundColor: 'lightgrey',
                padding: 12,
                marginVertical: 10,
                borderRadius: 10,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold'
            }}>Kehityksen Seuranta & Tallennetut Suoritukset ►</Text>
        </Pressable>
    )
}