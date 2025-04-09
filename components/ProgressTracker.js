import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const ProgressTracker = () => {
  const [selectedTab, setSelectedTab] = useState('Week');
  const [learnedCount, setLearnedCount] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);

  // Optional: use these counts to update the main progress ring
  const progress = Math.min(((learnedCount + matchedCount) / (2 * 247)) * 100, 100); // assuming 247 total characters

  const dataSets = {
    Week: [60, 75, 80, 90, 70, 88, 95],
    Month: [40, 45, 50, 60, 70, 85, 90],
    Year: [30, 50, 70, 80, 90, 95, 100],
  };

  const labels = {
    Week: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    Month: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    Year: ['J', 'F', 'M', 'A', 'M', 'J', 'J'],
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const learningData = await AsyncStorage.getItem('learningProgress');
        const matchingData = await AsyncStorage.getItem('matchingProgress');

        const learned = learningData ? JSON.parse(learningData) : [];
        const matched = matchingData ? JSON.parse(matchingData) : [];

        setLearnedCount(learned.length);
        setMatchedCount(matched.length);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Progress Tracker</Text>

      {/* Main Circular Progress */}
      <View style={styles.mainCircle}>
        <AnimatedCircularProgress
          size={180}
          width={15}
          fill={progress}
          tintColor="#3b82f6"
          backgroundColor="#e6f0ff"
          duration={1000}
          rotation={0}
        >
          {fill => (
            <Text style={styles.mainProgressText}>{`${Math.round(fill)}%`}</Text>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.subText}>Current Completion</Text>
      </View>

      {/* Tab Switch */}
      <View style={styles.tabSwitch}>
        {['Week', 'Month', 'Year'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab ? styles.tabSelected : styles.tabUnselected,
            ]}
          >
            <Text style={selectedTab === tab ? styles.tabTextSelected : styles.tabTextUnselected}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: labels[selectedTab],
          datasets: [{ data: dataSets[selectedTab] }],
        }}
        width={screenWidth - 32}
        height={240}
        yAxisSuffix="%"
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f0f4ff',
          backgroundGradientTo: '#d9e6ff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#3b82f6',
          },
        }}
        bezier
        style={styles.chart}
      />

      {/* Mini Progress Rings */}
      <View style={styles.miniProgressRings}>
        <View style={styles.ringItem}>
          <AnimatedCircularProgress
            size={90}
            width={8}
            fill={(learnedCount / 247) * 100}
            tintColor="#60a5fa"
            backgroundColor="#e0f2fe"
            duration={1000}
            rotation={0}
          >
            {() => <Text style={styles.ringText}>{`Learned\n${learnedCount}`}</Text>}
          </AnimatedCircularProgress>
        </View>
        <View style={styles.ringItem}>
          <AnimatedCircularProgress
            size={90}
            width={8}
            fill={(matchedCount / 247) * 100}
            tintColor="#c084fc"
            backgroundColor="#f3e8ff"
            duration={1000}
            rotation={0}
          >
            {() => <Text style={styles.ringText}>{`Matched\n${matchedCount}`}</Text>}
          </AnimatedCircularProgress>
        </View>
      </View>

      {/* Summary Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Learning Progress</Text>
          <Text style={styles.cardDetail}>Characters Learned: {learnedCount}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Matching Game Progress</Text>
          <Text style={styles.cardDetail}>Pairs Matched: {matchedCount}</Text>
        </View>
      </View>

      {/* Highlights Section */}
      <View style={styles.highlightsSection}>
        <Text style={styles.highlightsTitle}>Highlights</Text>
        <View style={styles.highlightBoxRow}>
          <View style={styles.boxStyle}>
            <FontAwesome5 name="fire" size={24} color="#f97316" />
            <Text style={styles.boxText}>Streak: 6 Days</Text>
          </View>
          <View style={styles.boxStyle}>
            <MaterialIcons name="leaderboard" size={24} color="#10b981" />
            <Text style={styles.boxText}>Top Score: 95%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#dbeafe', // 💙 Pastel Blue Background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1e3a8a',
  },
  mainCircle: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mainProgressText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  subText: {
    marginTop: 10,
    fontSize: 16,
    color: '#334155',
  },
  tabSwitch: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  tabSelected: {
    backgroundColor: '#3b82f6',
  },
  tabUnselected: {
    backgroundColor: '#e6f0ff',
  },
  tabTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabTextUnselected: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
  miniProgressRings: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  ringItem: {
    alignItems: 'center',
  },
  ringText: {
    color: '#1d4ed8',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDetail: {
    color: '#10b981',
    fontSize: 14,
    marginTop: 4,
  },
  highlightsSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  highlightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highlightBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxStyle: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  boxText: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
  },
});

export default ProgressTracker;