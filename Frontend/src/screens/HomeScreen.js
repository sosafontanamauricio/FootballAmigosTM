// frontend/src/screens/HomeScreen.js
import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
            <Text style={{ color: 'white', fontSize: 24 }}>¡Bienvenido a Football Amigos MT!</Text>
        </View>
    );
};

export default HomeScreen;