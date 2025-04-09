import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password required.');
      return;
    }

    await AsyncStorage.setItem('email', email);
    await AsyncStorage.setItem('password', password);

    Alert.alert('Success', 'Registered Successfully!');
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.link}>
          Already have an account? <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#EDE7F6',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#4FC3F7',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BA68C8',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#81C784',
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
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  link: {
    textAlign: 'center',
    color: '#37474F',
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  linkHighlight: {
    color: '#FF6F61',
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
  },
});

export default RegisterScreen;
