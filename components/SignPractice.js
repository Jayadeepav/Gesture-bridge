import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { CameraView, Camera } from 'expo-camera'; 
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

const API_URL = 'http://192.168.1.7:8000/detect/';

const SignPractice = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [predictedText, setPredictedText] = useState("");
  const [finalTextArray, setFinalTextArray] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [lastDetected, setLastDetected] = useState("");
  const [cameraType, setCameraType] = useState('front');
  const [isDetecting, setIsDetecting] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const processFrame = async () => {
    if (!cameraRef.current || isPredicting) return;
    setIsPredicting(true);
    
    try {
      const { uri } = await cameraRef.current.takePictureAsync({ base64: false });

      const resizedPhoto = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 640, height: 640 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const formData = new FormData();
      formData.append('file', {
        uri: resizedPhoto.uri,
        name: 'sign.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const detectedText = response.data.detected_text;

      if (detectedText && detectedText !== "No sign detected" && detectedText !== "Background") {
        setPredictedText(detectedText);
        if (detectedText !== lastDetected) {
          setFinalTextArray(prevArray => [...prevArray, detectedText]);
          setLastDetected(detectedText);
        }
      }
    } catch (error) {
      console.error('Error processing frame:', error);
      setPredictedText("Error detecting sign");
    }

    setIsPredicting(false);
  };

  const startDetection = () => {
    setPredictedText("");
    setFinalTextArray([]);
    setLastDetected("");
    setIsDetecting(true);
    intervalRef.current = setInterval(() => {
      processFrame();
    }, 5000);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    clearInterval(intervalRef.current);
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ede9fe" barStyle="dark-content" />
      <Text style={styles.title}>Real-Time Sign Recognition</Text>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} />

      <View style={styles.textContainer}>
        <Text style={styles.predictionText}>
          {isDetecting ? (predictedText ? predictedText : "Waiting for sign detection...") : finalTextArray.join("")}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={startDetection}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={stopDetection}>
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.switchButton} onPress={() => setCameraType(prev => (prev === 'front' ? 'back' : 'front'))}>
        <Text style={styles.buttonText}>Switch Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4EF', // soft coral-peach
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
    color: '#FF6B6B', // coral red
    marginBottom: 16,
  },
  camera: {
    width: '90%',
    height: '50%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderColor: '#FFB5A7', // soft coral-pink
    borderWidth: 3,
  },
  textContainer: {
    backgroundColor: "#FDFDFD",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginTop: 12,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    width: '85%',
  },
  predictionText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#222",
    fontFamily: 'Poppins-Regular',
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  startButton: {
    backgroundColor: '#00BFA6', // teal green
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    elevation: 4,
  },
  stopButton: {
    backgroundColor: '#EF476F', // vibrant pink-red
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    elevation: 4,
  },
  switchButton: {
    backgroundColor: '#FFD166', // sunshine yellow
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    marginTop: 24,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
    letterSpacing: 0.5,
  },
});

export default SignPractice;
