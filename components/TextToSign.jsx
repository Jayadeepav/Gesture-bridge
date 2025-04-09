import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TamilImageMap from "./TamilImageMap";

function splitTamilText(text) {
  const letters = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (next && next >= "\u0BBE" && next <= "\u0BCD") {
      letters.push(ch + next);
      i++;
    } else {
      letters.push(ch);
    }
  }
  return letters;
}

export default function SignAnimation() {
  const [sequence, setSequence] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [showReplay, setShowReplay] = useState(false);

  const prepareAnimation = (text) => {
    const tokens = splitTamilText(text);
    tokens.push(" ");
    setSequence(tokens);
    setIndex(0);
    setIsAnimating(true);
    setShowReplay(false);
  };

  const startAnimation = () => {
    if (!userInput.trim()) return;
    prepareAnimation(userInput);
  };

  const replayAnimation = () => {
    prepareAnimation(userInput);
  };

  useEffect(() => {
    let interval;
    if (isAnimating && sequence.length > 0) {
      interval = setInterval(() => {
        setIndex((prev) => {
          if (prev + 1 < sequence.length) return prev + 1;
          clearInterval(interval);
          setIsAnimating(false);
          setShowReplay(true);
          return prev;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnimating, sequence]);

  const currentLetter = sequence[index];
  const imageSource =
    TamilImageMap[currentLetter] || require("../assets/signs/white.jpg");

  return (
    <ImageBackground
      source={require("../assets/TextSpeech-SignBg.jpg")} // <-- your background image path
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>தமிழ் உள்ளீடு (Tamil Input)</Text>

        <TextInput
          style={styles.input}
          placeholder="Type here"
          placeholderTextColor="#B39DDB"
          value={userInput}
          onChangeText={(text) => {
            setUserInput(text);
            setShowReplay(false);
          }}
        />

        <TouchableOpacity style={styles.button} onPress={startAnimation}>
          <Text style={styles.buttonText}>Generate Sign Language</Text>
        </TouchableOpacity>

        {isAnimating && (
          <View style={styles.imageBox}>
            <Image source={imageSource} style={styles.image} />
            <Text style={styles.letterText}>{currentLetter}</Text>
          </View>
        )}

        {!isAnimating && showReplay && (
          <TouchableOpacity style={styles.replayButton} onPress={replayAnimation}>
            <Text style={styles.buttonText}>🔁 Replay Animation</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    color: "#FF6B6B",
    marginBottom: 20,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#FFB5A7",
    borderRadius: 16,
    padding: 14,
    fontSize: 18,
    backgroundColor: "#FFFFFF",
    color: "#222",
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: "#00BFA6",
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#00BFA6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  replayButton: {
    backgroundColor: "#FFD166",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginTop: 30,
    elevation: 4,
    shadowColor: "#FFD166",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  imageBox: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    marginTop: 32,
    backgroundColor: "#FDFDFD",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 12,
  },
  letterText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#EF476F",
    marginTop: 12,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});
