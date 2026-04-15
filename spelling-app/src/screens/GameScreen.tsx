import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Word, WrongWord } from '../types';
import { getRandomWords } from '../data/words';
import { Feedback } from '../components/Feedback';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const GAME_DURATION = 30 * 60; // 30 minutes in seconds

export const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { difficulty, practiceWords } = route.params;
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [showHint, setShowHint] = useState(false);
  const [wrongWords, setWrongWords] = useState<WrongWord[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

  // Initialize game
  useEffect(() => {
    if (practiceWords && practiceWords.length > 0) {
      setWords(practiceWords);
    } else {
      setWords(getRandomWords(difficulty, 10));
    }
  }, [difficulty, practiceWords]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0) {
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
  }, [timeLeft]);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const speakWord = useCallback(() => {
    if (words[currentIndex]) {
      Speech.stop();
      Speech.speak(words[currentIndex].word, { rate: 0.7 });
    }
  }, [words, currentIndex]);

  const endGame = useCallback(() => {
    navigation.navigate('Results', {
      score,
      totalWords: words.length,
      wrongWords,
      difficulty,
    });
  }, [score, words.length, wrongWords, difficulty, navigation]);

  const checkAnswer = useCallback(() => {
    if (!words[currentIndex]) return;

    const trimmedInput = userInput.trim().toLowerCase();
    const correctWord = words[currentIndex].word.toLowerCase();
    const isCorrect = trimmedInput === correctWord;

    // Show feedback
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);

    if (isCorrect) {
      setScore(s => s + 10 + streak);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
      setWrongWords(prev => [
        ...prev,
        { word: words[currentIndex], userAnswer: userInput.trim() },
      ]);
    }

    // Wait for user to see feedback, then move to next word
    setTimeout(() => {
      if (currentIndex >= words.length - 1) {
        endGame();
      } else {
        setCurrentIndex(i => i + 1);
        setUserInput('');
        setShowHint(false);
        setShowFeedback(false);
      }
    }, 2000);
  }, [words, currentIndex, userInput, streak, endGame]);

  const currentWord = words[currentIndex];

  return (
    <View style={styles.container}>
      {/* Timer and Score */}
      <View style={styles.header}>
        <Text style={styles.timer}>⏱️ {formatTime(timeLeft)}</Text>
        <Text style={styles.score}>Score: {score} | Streak: {streak}</Text>
      </View>

      {currentWord && (
        <>
          {/* Word Progress */}
          <Text style={styles.wordNumber}>
            Word {currentIndex + 1} of {words.length}
          </Text>

          {/* Audio Pronunciation Button */}
          <TouchableOpacity style={styles.speakButton} onPress={speakWord}>
            <Text style={styles.speakButtonText}>🔊 Listen</Text>
          </TouchableOpacity>

          {/* Hint */}
          {showHint && (
            <Text style={styles.hint}>💡 {currentWord.hint}</Text>
          )}

          {/* Answer Input */}
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type the word..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!showFeedback}
          />

          {/* Feedback Component */}
          {showFeedback && (
            <Feedback
              isCorrect={lastAnswerCorrect}
              userAnswer={userInput}
              correctAnswer={currentWord.word}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.hintButton, showFeedback && styles.disabledButton]}
              onPress={() => setShowHint(true)}
              disabled={showFeedback}
            >
              <Text style={styles.hintButtonText}>💡 Hint</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, showFeedback && styles.disabledButton]}
              onPress={checkAnswer}
              disabled={showFeedback}
            >
              <Text style={styles.submitButtonText}>✓ Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  header: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  score: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 5,
  },
  wordNumber: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  speakButton: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  speakButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff9c4',
    borderRadius: 8,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  hintButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  hintButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default GameScreen;