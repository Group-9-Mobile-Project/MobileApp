import { View, Button, Text } from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper'


export default function GraphContainer() {
    const [showYearly, setShowYearly] = useState<boolean>(true)
    const [chartType, setChartType] = useState('Matka')

    return (
        <View>
            <Button title={showYearly ? 'Näytä vuosinäkymä' : 'Näytä kuukausinäkymä'} onPress={() => setShowYearly(!showYearly)} />

            <RadioButton.Group
                onValueChange={(value) => setChartType(value)}
                value={chartType}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                        <RadioButton value='Matka' />
                        <Text>Matka</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value='Kesto' />
                        <Text>Kesto</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value='Keskinopeus' />
                        <Text>Keskinopeus</Text>
                    </View>
                </View>
            </RadioButton.Group>

            <Text>Suoritusten {chartType}</Text>
        </View>
    )
}