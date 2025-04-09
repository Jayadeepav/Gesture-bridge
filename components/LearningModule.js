import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from './ImageMappings';
import characterMap from './CharacterMap';

const LearningModule = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [learned, setLearned] = useState([]);

  const categories = [
    { id: 'vowels', name: 'Vowels (உயிரெழுத்துக்கள்)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 'consonants', name: 'Consonants (மெய்யெழுத்துக்கள்)', items: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
    {
      id: 'compound',
      name: 'Compound Letters (உயிர்மெய் எழுத்துகள்)',
      subcategories: [
        { id: 'ka-series', name: 'க வரிசை', items: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43] },
        { id: 'nga-series', name: 'ங வரிசை', items: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55] },
        { id: 'sa-series', name: 'ச வரிசை', items: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67] },
        { id: 'nja-series', name: 'ஞ வரிசை', items: [68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79] },
        { id: 'ta-series', name: 'ட வரிசை', items: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91] },
        { id: 'na-series', name: 'ண வரிசை', items: [92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103] },
        { id: 'tha-series', name: 'த வரிசை', items: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115] },
        { id: 'na2-series', name: 'ந வரிசை', items: [116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127] },
        { id: 'pa-series', name: 'ப வரிசை', items: [128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139] },
        { id: 'ma-series', name: 'ம வரிசை', items: [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151] },
        { id: 'ya-series', name: 'ய வரிசை', items: [152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163] },
        { id: 'ra-series', name: 'ர வரிசை', items: [164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175] },
        { id: 'la-series', name: 'ல வரிசை', items: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187] },
        { id: 'va-series', name: 'வ வரிசை', items: [188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199] },
        { id: 'zha-series', name: 'ழ வரிசை', items: [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211] },
        { id: 'la2-series', name: 'ள வரிசை', items: [212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223] },
        { id: 'ra2-series', name: 'ற வரிசை', items: [224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235] },
        { id: 'na3-series', name: 'ன வரிசை', items: [236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247] },
      ],
    },
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSelectedCharacter(null);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    setSelectedCharacter(null);
  };

  const handleCharacterSelect = async (characterId) => {
    setSelectedCharacter(characterId);
    try {
      const existingProgress = await AsyncStorage.getItem('learningProgress');
      const parsedProgress = existingProgress ? JSON.parse(existingProgress) : [];
      if (!parsedProgress.includes(characterId)) {
        const updatedProgress = [...parsedProgress, characterId];
        await AsyncStorage.setItem('learningProgress', JSON.stringify(updatedProgress));
      }
    } catch (error) {
      console.error('Error saving learning progress', error);
    }
  };

  useEffect(() => {
    const loadProgress = async () => {
      const data = await AsyncStorage.getItem('learningProgress');
      setLearned(data ? JSON.parse(data) : []);
    };
    loadProgress();
  }, [selectedCategory, selectedSubcategory]);

  const renderItems = (items) => {
    return items.map((item) => (
      <TouchableOpacity
        key={item}
        style={styles.characterButton}
        onPress={() => handleCharacterSelect(item)}
      >
        <Text style={styles.characterButtonText}>
          {characterMap[item]} {learned.includes(item) ? '✅' : ''}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ImageBackground
      source={require('../assets/BackgroundImage.jpg')} // 🔧 ensure this path is correct
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Tamil Sign Language Learning</Text>
        <ScrollView style={styles.scrollContainer}>
          {!selectedCategory && (
            <>
              <Text style={styles.sectionTitle}>Select a Category:</Text>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryButton}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  <Text style={styles.categoryButtonText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {selectedCategory && !selectedSubcategory && (
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => handleCategorySelect(null)}
              >
                <Text style={styles.backButtonText}>← Back to Categories</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Select a Subcategory:</Text>
              {categories
                .find((cat) => cat.id === selectedCategory)
                ?.subcategories?.map((subcat) => (
                  <TouchableOpacity
                    key={subcat.id}
                    style={styles.categoryButton}
                    onPress={() => handleSubcategorySelect(subcat.id)}
                  >
                    <Text style={styles.categoryButtonText}>{subcat.name}</Text>
                  </TouchableOpacity>
                )) || renderItems(categories.find((cat) => cat.id === selectedCategory).items)}
            </>
          )}

          {selectedSubcategory && (
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => handleSubcategorySelect(null)}
              >
                <Text style={styles.backButtonText}>← Back to Subcategories</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Select a Character:</Text>
              {renderItems(
                categories
                  .find((cat) => cat.id === selectedCategory)
                  .subcategories.find((subcat) => subcat.id === selectedSubcategory)
                  .items
              )}
            </>
          )}
        </ScrollView>

        {selectedCharacter && (
          <View style={styles.characterDisplay}>
            <Image
              source={images[selectedCharacter]}
              style={styles.characterImage}
              resizeMode="contain"
            />
            <Text style={styles.characterText}>
              Tamil Character: {characterMap[selectedCharacter]}
            </Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#3E2C41',
    textAlign: 'center',
    marginBottom: 18,
  },
  scrollContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#4C1D95',
    marginBottom: 12,
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: "#296D98",
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 12,
    padding: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#6D28D9',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  characterButton: {
    backgroundColor: "#1C4966",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    elevation: 3,
  },
  characterButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  characterDisplay: {
    alignItems: 'center',
    marginTop: 30,
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    elevation: 5,
  },
  characterImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#F8F1FF',
    marginBottom: 16,
  },
  characterText: {
    fontSize: 20,
    color: '#4C1D95',
    fontFamily: 'Poppins-Bold',
  },
});

export default LearningModule;
