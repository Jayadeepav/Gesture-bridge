import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#D1C4E9', '#B2EBF2', '#E1BEE7']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.navbar}>
          <View style={styles.navLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('LearningModule')}>
              <Text style={styles.navText}>Learn</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ConvertOptions')}>
              <Text style={styles.navText}>Convert</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StartScreen')}>
              <Text style={styles.navText}>Games</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ProgressTracker')}>
              <Text style={styles.navText}>Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Image
            source={require('../assets/image.png')} // adjust path as needed
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>GestureBridge</Text>
          <Text style={styles.subtitle}>
            Empowering Hearing and Speech Impaired People through Tamil Sign Language
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  navbar: {
    width: '100%',
    backgroundColor: 'rgba(55, 65, 81, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navLinks: {
    flexDirection: 'row',
  },
  navText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: '#37474F',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default HomeScreen;
