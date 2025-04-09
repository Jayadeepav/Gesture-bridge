import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ImageBackground,
} from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';
import { WebView } from 'react-native-webview';

export default function SpeechToSign() {
  const [gifUri, setGifUri] = useState(null);
  const [fingerspelling, setFingerspelling] = useState([]);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const opacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (fingerspelling.length > 0) {
      let i = 0;
      const animate = () => {
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(1200),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          i = (i + 1) % fingerspelling.length;
          setCurrentLetterIndex(i);
        });
      };
      const interval = setInterval(animate, 1800);
      animate();
      return () => clearInterval(interval);
    }
  }, [fingerspelling]);

  const recordAndSendAudio = async () => {
    setGifUri(null);
    setFingerspelling([]);
    setTranscription('');
    setLoading(true);

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      await new Promise((resolve) => setTimeout(resolve, 5000));
      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'speech.wav',
        type: 'audio/wav',
      });

      const res = await axios.post('http://192.168.1.7:9000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.transcription) {
        setTranscription(res.data.transcription);
      }

      if (res.data.match === 'gif') {
        setGifUri(`http://192.168.1.7:9000/static/gifs/${res.data.value}`);
      } else if (res.data.match === 'letters') {
        setFingerspelling(res.data.value);
      }
    } catch (error) {
      console.error('Error during speech-to-sign:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/TextSpeech-SignBg.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🗣️ Tamil Speech ➡️ Sign Language</Text>

        <TouchableOpacity style={styles.recordButton} onPress={recordAndSendAudio}>
          <Text style={styles.recordText}>
            {loading ? '🎧 Listening...' : '🎙️ Record Tamil Speech'}
          </Text>
        </TouchableOpacity>

        {transcription !== '' && (
          <View style={styles.transcriptionCard}>
            <Text style={styles.transcriptionLabel}>📝 Transcribed Text</Text>
            <Text style={styles.transcriptionText}>{transcription}</Text>
          </View>
        )}

        {gifUri && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>💬 Sign Representation</Text>
            <WebView
              originWhitelist={['*']}
              source={{
                html: `
                  <html>
                    <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background-color:#fff;">
                      <img src="${gifUri}" style="width:100%;height:100%;object-fit:contain;" />
                    </body>
                  </html>`,
              }}
              style={styles.webview}
              scrollEnabled={false}
              javaScriptEnabled
              scalesPageToFit
            />
          </View>
        )}

        {fingerspelling.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>🔡 Fingerspelling</Text>
            <Animated.Image
              source={{
                uri: `http://192.168.1.7:9000/static/signs/${fingerspelling[currentLetterIndex]}.jpg`,
              }}
              style={[styles.fingerImgAnimated, { opacity }]}
              resizeMode="contain"
            />
            <Animated.Text style={[styles.letterCaption, { opacity }]}>
              {fingerspelling[currentLetterIndex]}
            </Animated.Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center', // Center vertically
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B',
    marginBottom: 28,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: '#00BFA6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginBottom: 20,
  },
  recordText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  transcriptionCard: {
    backgroundColor: '#FFEFEA',
    padding: 18,
    borderRadius: 18,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#FFB5A7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  transcriptionLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FF6B6B',
    marginBottom: 6,
  },
  transcriptionText: {
    fontSize: 18,
    color: '#222',
    fontFamily: 'Poppins-Regular',
    lineHeight: 26,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FFB5A7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#EF476F',
    marginBottom: 14,
  },
  webview: {
    width: 300,
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  fingerImgAnimated: {
    width: 160,
    height: 180,
    borderRadius: 16,
    backgroundColor: '#FFF1F1',
    marginBottom: 12,
  },
  letterCaption: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#EF476F',
    textAlign: 'center',
  },
});
