import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
      await AsyncStorage.setItem("loggedInUser", email);
      navigation.replace('HomeScreen');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>GestureBridge</Text>
      <Text style={styles.title}>Welcome Back!</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#90A4AE"
        style={styles.input}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#90A4AE"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>Don't have an account? <Text style={styles.linkHighlight}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: "#EDE7F6",
  },
  appName: {
    fontSize: 34,
    fontFamily: 'Poppins-Bold',
    color: "#4FC3F7",
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    color: "#37474F",
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: "#BA68C8",
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: "#81C784",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  link: {
    textAlign: 'center',
    color: "#37474F",
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  linkHighlight: {
    color: "#FF6F61",
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
  }
});

export default LoginScreen;
