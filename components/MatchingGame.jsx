import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ScrollView } from "react-native";
import FlipCard from "react-native-flip-card";
import AsyncStorage from '@react-native-async-storage/async-storage';


const screenWidth = Dimensions.get("window").width;

const words = [
  { id: 1, image: require("../assets/signs/த.jpg"), value: "த" },
  { id: 2, image: require("../assets/signs/மி.jpg"), value: "மி" },
  { id: 3, image: require("../assets/signs/ழ்.jpg"), value: "ழ்" },
  { id: 4, image: require("../assets/signs/த.jpg"), value: "த" },
  { id: 5, image: require("../assets/signs/மி.jpg"), value: "மி" },
  { id: 6, image: require("../assets/signs/ழ்.jpg"), value: "ழ்" },
];

const shuffleCards = () => {
  return words
    .sort(() => Math.random() - 0.5)
    .map((word, index) => ({ ...word, flipped: false, matched: false, index }));
};

const MatchingGame = () => {
  const [cards, setCards] = useState(shuffleCards());
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardPress = (index) => {
    if (selectedCards.length === 2 || cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelectedCards([...selectedCards, { ...newCards[index], index }]);
  };

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;

      setTimeout(() => {
        if (first.value === second.value) {
            const newCards = cards.map((card) =>
              card.value === first.value ? { ...card, matched: true } : card
            );
            setCards(newCards);
            saveMatchingProgress(first.value);
          }
        else {
          const newCards = [...cards];
          newCards[first.index].flipped = false;
          newCards[second.index].flipped = false;
          setCards(newCards);
        }
        setSelectedCards([]);
      }, 1000);
    }
  }, [selectedCards]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      Alert.alert("🎉 Congratulations!", "You matched all pairs!", [
        { text: "OK", onPress: () => setCards(shuffleCards()) },
      ]);
    }
  }, [cards]);

  const saveMatchingProgress = async (value) => {
    try {
      const existingProgress = await AsyncStorage.getItem('matchingProgress');
      const parsedProgress = existingProgress ? JSON.parse(existingProgress) : [];
  
      if (!parsedProgress.includes(value)) {
        const updatedProgress = [...parsedProgress, value];
        await AsyncStorage.setItem('matchingProgress', JSON.stringify(updatedProgress));
      }
    } catch (error) {
      console.error('Error saving matching progress', error);
    }
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match the Tamil Letters</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity key={index} onPress={() => handleCardPress(index)} activeOpacity={0.9}>
            <FlipCard flip={card.flipped} clickable={false} style={styles.card}>
              {/* Front Side */}
              <View style={styles.front}>
                <Text style={styles.cardText}>?</Text>
              </View>
              {/* Back Side (Only Image & Letter) */}
              <View style={styles.back}>
                <Image source={card.image} style={styles.cardImage} />
                <Text style={styles.label}>{card.value}</Text>
              </View>
            </FlipCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Restart Button */}
      <TouchableOpacity style={styles.button} onPress={() => setCards(shuffleCards())}>
        <Text style={styles.buttonText}>Restart Game</Text>
      </TouchableOpacity>
    </View>
  );
};

const cardSize = (screenWidth - 60) / 3; // Bigger image size

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E0", // Light beige background
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    color: "#6A1B9A",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    width: cardSize,
    height: cardSize + 20,
    margin: 10,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  front: {
    backgroundColor: "#FF6F61",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 12,
  },
  back: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 12,
    backgroundColor: "transparent", // No background color!
  },
  cardImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  label: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#000",
    marginTop: 5,
  },
  cardText: {
    fontSize: 30,
    color: "#FFF",
    fontFamily: "Poppins-Bold",
  },
  button: {
    backgroundColor: "#FF4081",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFF",
    fontFamily: "Poppins-Regular",
  },
});

export default MatchingGame;