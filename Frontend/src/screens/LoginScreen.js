// frontend/src/screens/LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { COLORS } from '../styles/colors';
// Nota: Deberías poner tu logo FA.png en la carpeta assets y referenciarlo.
const Logo = require('../../assets/logo_fa_placeholder.png'); 

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [nombre, setNombre] = useState('');

    const handleAuth = async () => {
        const endpoint = isRegisterMode ? 'register' : 'login';
        const body = isRegisterMode 
            ? JSON.stringify({ nombre, email, password })
            : JSON.stringify({ email, password });

        try {
            const response = await fetch(`https://endocrinopathic-unsectionalized-zula.ngrok-free.dev/api/auth/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Éxito", data.message || (isRegisterMode ? "Registro exitoso." : "Inicio de sesión exitoso."));
                
                // Si el login es exitoso, redirigir a Home/Admin
                if (!isRegisterMode && data.token) {
                    // Aquí guardarías el token JWT y navegarías
                    navigation.navigate('Home'); 
                }
            } else {
                Alert.alert("Error", data.message || "Ocurrió un error en el servidor.");
            }
        } catch (error) {
            console.error("Error de red:", error);
            Alert.alert("Error de Conexión", "No se pudo conectar al servidor. Asegúrate de que el backend esté corriendo en localhost:3000.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.title}>
                {isRegisterMode ? 'Crea tu Cuenta' : 'Accede a Football Amigos MT'}
            </Text>

            {isRegisterMode && (
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Completo"
                    placeholderTextColor={COLORS.WHITE_LIGHT}
                    value={nombre}
                    onChangeText={setNombre}
                />
            )}
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.WHITE_LIGHT}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={COLORS.WHITE_LIGHT}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.buttonPrimary} onPress={handleAuth}>
                <Text style={styles.buttonText}>{isRegisterMode ? 'REGISTRARME' : 'INICIAR SESIÓN'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegisterMode(!isRegisterMode)}>
                <Text style={styles.switchText}>
                    {isRegisterMode 
                        ? "¿Ya tienes cuenta? Inicia Sesión" 
                        : "¿No tienes cuenta? Regístrate aquí"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BLACK,
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.WHITE,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: COLORS.GRAY_DARK,
        borderRadius: 8,
        paddingHorizontal: 15,
        color: COLORS.WHITE,
        marginBottom: 15,
        fontSize: 16,
    },
    buttonPrimary: {
        width: '100%',
        backgroundColor: COLORS.RED,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: COLORS.WHITE,
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchText: {
        color: COLORS.WHITE_LIGHT,
        fontSize: 14,
        marginTop: 10,
    },
});

export default LoginScreen;