import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Difficulty } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface DifficultyOption {
  key: Difficulty;
  label: string;
  color: string;
  emoji: string;
}

const difficulties: DifficultyOption[] = [
  { key: 'simple', label: 'Simple', color: '#4CAF50', emoji: '🌱' },
  { key: 'medium', label: 'Medium', color: '#FF9800', emoji: '🌿' },
  { key: 'hard', label: 'Hard', color: '#F44336', emoji: '🌲' },
  { key: 'veryHard', label: 'Very Hard', color: '#9C27B0', emoji: '🏔️' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Spelling Master</Text>
      <Text style={styles.subtitle}>Choose your difficulty level</Text>
      
      <View style={styles.buttonsContainer}>
        {difficulties.map(({ key, label, color, emoji }) => (
          <TouchableOpacity
            key={key}
            style={[styles.button, { backgroundColor: color }]}
            onPress={() => handleDifficultySelect(key)}
          >
            <Text style={styles.buttonEmoji}>{emoji}</Text>
            <Text style={styles.buttonText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 15,
  },
  button: {
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomeScreen;