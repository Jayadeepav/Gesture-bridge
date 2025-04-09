import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import HomeScreen from './components/HomeScreen';
import LearningModule from './components/LearningModule';
import SignPractice from './components/SignPractice';
import ConvertOptions from './components/ConvertOptions';
import TextToSign from './components/TextToSign';
import SpeechToSign from './components/SpeechToSign';
import MatchingGame from './components/MatchingGame';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import StartScreen from './components/StartScreen';
import ProgressTracker from './components/ProgressTracker';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [isTfReady, setIsTfReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    async function loadTensorFlow() {
      console.log("Loading TensorFlow...");
      await tf.ready();
      console.log("TensorFlow is ready!");
      setIsTfReady(true);
    }

    loadTensorFlow();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ✅ After all hooks, then return null if fonts not ready
  if (!fontsLoaded) {
    return null;
  }

  if (!isTfReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LearningModule" component={LearningModule} />
          <Stack.Screen name="SignPractice" component={SignPractice} />
          <Stack.Screen name="ConvertOptions" component={ConvertOptions} />
          <Stack.Screen name="TextToSign" component={TextToSign} />
          <Stack.Screen name="SpeechToSign" component={SpeechToSign} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="MatchingGame" component={MatchingGame} />
          <Stack.Screen name="ProgressTracker" component={ProgressTracker} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
