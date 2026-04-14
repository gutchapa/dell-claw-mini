import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { loadStats, createInitialStats } from '../utils/storage';
import { Difficulty } from '../types';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const difficulties: { key: Difficulty; label: string; color: string; emoji: string }[] = [
  { key: 'simple', label: 'Simple', color: '#4CAF50', emoji: '🌱' },
  { key: 'medium', label: 'Medium', color: '#FF9800', emoji: '🌿' },
  { key: 'hard', label: 'Hard', color: '#F44336', emoji: '🌲' },
  { key: 'veryHard', label: 'Very Hard', color: '#9C27B0', emoji: '🏔️' },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [stats, setStats] = useState(createInitialStats());

  useEffect(() => {
    loadStats().then(loaded => {
      if (loaded) setStats(loaded);
    });
  }, []);

  const startGame = (difficulty: Difficulty) => {
    Alert.alert(
      'Start Game?',
      `You'll have 30 minutes to practice spelling at ${difficulty} level.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start!', onPress: () => navigation.navigate('Game', { difficulty }) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Spelling Master</Text>
      <Text style={styles.subtitle}>Choose your level</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Games: {stats.totalGames} | Total Score: {stats.totalScore}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        {difficulties.map(({ key, label, color, emoji }) => (
          <TouchableOpacity
            key={key}
            style={[styles.button, { backgroundColor: color }]}
            onPress={() => startGame(key)}
          >
            <Text style={styles.buttonEmoji}>{emoji}</Text>
            <Text style={styles.buttonText}>{label}</Text>
            <Text style={styles.buttonSubtext}>
              {stats.difficultyStats[key].gamesPlayed} games played
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.tip}>💡 Tip: Listen to pronunciation carefully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 40, color: '#333' },
  subtitle: { fontSize: 18, textAlign: 'center', marginTop: 10, color: '#666' },
  statsContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginTop: 20, elevation: 2 },
  statsText: { textAlign: 'center', fontSize: 16, color: '#333' },
  buttonsContainer: { marginTop: 30, gap: 15 },
  button: { padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3 },
  buttonEmoji: { fontSize: 40, marginBottom: 5 },
  buttonText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  buttonSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  tip: { textAlign: 'center', marginTop: 30, fontSize: 14, color: '#666', fontStyle: 'italic' },
});
