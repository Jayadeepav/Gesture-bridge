import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tamil Sign Language Matching Game</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MatchingGame")}>
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6A1B9A", // Dark Purple
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#FFD700", // Gold color
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFC107", // Yellow button
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    color: "#000",
  },
});


export default StartScreen;