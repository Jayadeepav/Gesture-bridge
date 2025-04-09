import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ConvertOptions = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../assets/Convert-Bg.jpg')} // path to your image
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
  colors={['#FFEFE822', '#FFDADA22', '#FFF4E622']}
  style={styles.container}
>

        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

        <Text style={styles.title}>Welcome 🙏🏻</Text>
        <Text style={styles.subtitle}>Choose your preferred conversion</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignPractice')}
        >
          <Text style={styles.buttonText}>🤳 Sign to Text</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TextToSign')}
        >
          <Text style={styles.buttonText}>📝 Text to Sign</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SpeechToSign')}
        >
          <Text style={styles.buttonText}>🎙️ Speech to Sign</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#3D348B',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#7678ED',
    marginBottom: 36,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F9844A',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginVertical: 12,
    width: '85%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#F9844A',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.6,
  },
});

export default ConvertOptions;
