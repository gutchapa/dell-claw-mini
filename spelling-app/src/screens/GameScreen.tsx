import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { RootStackParamList } from '../../App';
import { getRandomWords } from '../data/words';
import { loadStats, saveStats, updateStats, createInitialStats } from '../utils/storage';
import { Word, Difficulty } from '../types';

type GameScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

const GAME_DURATION = 30 * 60; // 30 minutes in seconds

export default function GameScreen({ navigation, route }: GameScreenProps) {
  const { difficulty } = route.params;
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const gameWords = getRandomWords(difficulty, 50);
    setWords(gameWords);
  }, [difficulty]);

  useEffect(() => {
    if (timeLeft > 0 && words.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, words]);

  const speakWord = () => {
    if (words[currentIndex]) {
      Speech.speak(words[currentIndex].word, {
        rate: 0.8,
        pitch: 1.0,
      });
    }
  };

  const checkAnswer = () => {
    if (!words[currentIndex]) return;
    
    const correct = userInput.toLowerCase().trim() === words[currentIndex].word.toLowerCase();
    
    if (correct) {
      setScore(s => s + 10 + streak);
      setStreak(s => s + 1);
      Alert.alert('✅ Correct!', `+${10 + streak} points`, [{ text: 'Next', onPress: nextWord }]);
    } else {
      setStreak(0);
      Alert.alert('❌ Incorrect', `The word was: ${words[currentIndex].word}`, [
        { text: 'Next', onPress: nextWord }
      ]);
    }
  };

  const nextWord = () => {
    if (currentIndex >= words.length - 1) {
      endGame();
      return;
    }
    setCurrentIndex(i => i + 1);
    setUserInput('');
    setShowHint(false);
  };

  const endGame = async () => {
    const stats = await loadStats() || createInitialStats();
    const newStats = updateStats(stats, score, difficulty);
    await saveStats(newStats);
    navigation.navigate('Results', { score, total: (currentIndex + 1) * 10, difficulty });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (words.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>⏱️ {formatTime(timeLeft)}</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.streak}>🔥 {streak}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / words.length) * 100}%` }]} />
      </View>

      <View style={styles.wordContainer}>
        <Text style={styles.wordNumber}>Word {currentIndex + 1} of {words.length}</Text>
        
        <TouchableOpacity style={styles.speakButton} onPress={speakWord}>
          <Text style={styles.speakButtonText}>🔊 Listen</Text>
        </TouchableOpacity>

        {showHint && (
          <Text style={styles.hint}>💡 {words[currentIndex].hint}</Text>
        )}

        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Type the word you hear..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.hintButton} onPress={() => setShowHint(true)}>
            <Text style={styles.hintButtonText}>💡 Hint</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
            <Text style={styles.submitButtonText}>✓ Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderRadius: 10, marginBottom: 20 },
  timer: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  score: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  streak: { fontSize: 18, fontWeight: 'bold', color: '#FF9800' },
  progressBar: { height: 10, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 20 },
  progressFill: { height: '100%', backgroundColor: '#6200ee', borderRadius: 5 },
  wordContainer: { backgroundColor: '#fff', padding: 30, borderRadius: 15, elevation: 3 },
  wordNumber: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 20 },
  speakButton: { backgroundColor: '#6200ee', padding: 20, borderRadius: 50, alignItems: 'center', marginBottom: 20 },
  speakButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  hint: { textAlign: 'center', fontSize: 16, color: '#666', fontStyle: 'italic', marginBottom: 20, padding: 10, backgroundColor: '#fff9c4', borderRadius: 8 },
  input: { borderWidth: 2, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 20, textAlign: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  hintButton: { flex: 1, backgroundColor: '#FFC107', padding: 15, borderRadius: 10, alignItems: 'center' },
  hintButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  submitButton: { flex: 2, backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
