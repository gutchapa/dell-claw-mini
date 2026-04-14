import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as Speech from 'expo-speech';
import { getRandomWords } from './src/data/words';
import { Word, Difficulty } from './src/types';

const GAME_DURATION = 30 * 60;
const difficulties = [
  { key: 'simple', label: 'Simple', color: '#4CAF50', emoji: '🌱' },
  { key: 'medium', label: 'Medium', color: '#FF9800', emoji: '🌿' },
  { key: 'hard', label: 'Hard', color: '#F44336', emoji: '🌲' },
  { key: 'veryHard', label: 'Very Hard', color: '#9C27B0', emoji: '🏔️' },
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [difficulty, setDifficulty] = useState('simple');
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (screen === 'game' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setScreen('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [screen, timeLeft]);

  const startGame = (diff) => {
    setDifficulty(diff);
    setWords(getRandomWords(diff, 10));
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_DURATION);
    setUserInput('');
    setShowHint(false);
    setScreen('game');
  };

  const speakWord = () => {
    if (words[currentIndex]) {
      Speech.speak(words[currentIndex].word, { rate: 0.8 });
    }
  };

  const checkAnswer = () => {
    if (!words[currentIndex]) return;
    const correct = userInput.toLowerCase().trim() === words[currentIndex].word.toLowerCase();
    if (correct) {
      setScore(s => s + 10 + streak);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    if (currentIndex >= words.length - 1) {
      setScreen('results');
    } else {
      setCurrentIndex(i => i + 1);
      setUserInput('');
      setShowHint(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (screen === 'home') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎯 Spelling Master</Text>
        <Text style={styles.subtitle}>Choose your level</Text>
        <View style={styles.buttonsContainer}>
          {difficulties.map(({ key, label, color, emoji }) => (
            <TouchableOpacity key={key} style={[styles.button, { backgroundColor: color }]} onPress={() => startGame(key)}>
              <Text style={styles.buttonEmoji}>{emoji}</Text>
              <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (screen === 'results') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Game Over!</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#6200ee' }]} onPress={() => setScreen('home')}>
          <Text style={styles.buttonText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏱️ {formatTime(timeLeft)} | Score: {score}</Text>
      {words[currentIndex] && (
        <>
          <Text style={styles.wordNumber}>Word {currentIndex + 1} of {words.length}</Text>
          <TouchableOpacity style={styles.speakButton} onPress={speakWord}>
            <Text style={styles.speakButtonText}>🔊 Listen</Text>
          </TouchableOpacity>
          {showHint && <Text style={styles.hint}>💡 {words[currentIndex].hint}</Text>}
          <TextInput style={styles.input} value={userInput} onChangeText={setUserInput} placeholder="Type the word..." />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.hintButton} onPress={() => setShowHint(true)}>
              <Text>💡 Hint</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
              <Text style={styles.submitButtonText}>✓ Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 18, textAlign: 'center', color: '#666', marginBottom: 30 },
  scoreText: { fontSize: 24, textAlign: 'center', marginVertical: 20 },
  buttonsContainer: { gap: 15 },
  button: { padding: 20, borderRadius: 15, alignItems: 'center', marginVertical: 5 },
  buttonEmoji: { fontSize: 40, marginBottom: 5 },
  buttonText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  timer: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  wordNumber: { textAlign: 'center', fontSize: 16, color: '#666', marginBottom: 20 },
  speakButton: { backgroundColor: '#6200ee', padding: 20, borderRadius: 50, alignItems: 'center', marginBottom: 20 },
  speakButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  hint: { textAlign: 'center', fontSize: 16, fontStyle: 'italic', marginBottom: 20, padding: 10, backgroundColor: '#fff9c4', borderRadius: 8 },
  input: { borderWidth: 2, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 20, textAlign: 'center', marginBottom: 20, backgroundColor: '#fff' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  hintButton: { flex: 1, backgroundColor: '#FFC107', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButton: { flex: 2, backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
