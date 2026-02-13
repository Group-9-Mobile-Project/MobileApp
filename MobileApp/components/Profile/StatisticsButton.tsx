import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootTabParamList } from '../../types/Navigation';
import { Card } from 'react-native-paper';
import globalStyles from '../../themes/GlobalStyles';

export default function StatisticsButton() {
    const navigation = useNavigation<NavigationProp<RootTabParamList>>();

    return (
        <View style={globalStyles.EventFormContainer}>
            <Pressable
                onPress={() => navigation.navigate('Tilastot')}
                style={({ pressed }) => pressed && { opacity: 0.6 }}
                accessibilityRole="button"
                accessibilityLabel="Show user statistics">
                <Card style={globalStyles.cardContainer}>
                    <Card.Content>
                        <Text style={globalStyles.subHeading}>Kehityksen Seuranta & Tallennetut Suoritukset ►</Text>
                    </Card.Content>
                </Card>

            </Pressable>
        </View>
    )
}