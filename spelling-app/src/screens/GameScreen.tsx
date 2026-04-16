import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text, Card, Input, Button, ProgressBar, Icon } from '@ui-kitten/components';
import * as Speech from 'expo-speech';
import { RootStackParamList, Word, WrongWord } from '../types';
import { getRandomWords } from '../data/words';
import { Feedback } from '../components/Feedback';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const GAME_DURATION = 30 * 60;

const SpeakerIcon = (props: any) => (
  <Icon {...props} name='volume-up-outline' />
);

const HintIcon = (props: any) => (
  <Icon {...props} name='bulb-outline' />
);

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

  useEffect(() => {
    if (practiceWords && practiceWords.length > 0) {
      setWords(practiceWords);
    } else {
      setWords(getRandomWords(difficulty, 10));
    }
  }, [difficulty, practiceWords]);

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
  const progress = words.length > 0 ? (currentIndex + 1) / words.length : 0;

  return (
    <Layout style={styles.container}>
      {/* Header Stats */}
      <Layout style={styles.header}>
        <Layout style={styles.statRow}>
          <Text category='s1'>⏱️ {formatTime(timeLeft)}</Text>
          <Text category='s1'>Score: {score}</Text>
          <Text category='s1'>🔥 {streak}</Text>
        </Layout>
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          status='primary'
        />
        <Text category='c1' style={styles.progressText}>
          Word {currentIndex + 1} of {words.length}
        </Text>
      </Layout>

      {currentWord && (
        <Card style={styles.gameCard}>
          {/* Speak Button */}
          <Button
            style={styles.speakButton}
            accessoryLeft={SpeakerIcon}
            onPress={speakWord}
            status='primary'
          >
            Listen to Word
          </Button>

          {/* Masked Hint */}
          <Layout style={styles.maskedHintContainer}>
            <Text category='label' appearance='hint'>Hint:</Text>
            <Text category='h1' status='info' style={styles.maskedHint}>
              {currentWord.maskedHint}
            </Text>
          </Layout>

          {showHint && (
            <Text category='p2' style={styles.hintText}>
              💡 {currentWord.hint}
            </Text>
          )}

          {/* Input */}
          <Input
            style={styles.input}
            placeholder='Type the word...'
            value={userInput}
            onChangeText={setUserInput}
            disabled={showFeedback}
            autoCapitalize='none'
            autoCorrect={false}
          />

          {/* Feedback */}
          {showFeedback && (
            <Feedback
              isCorrect={lastAnswerCorrect}
              userAnswer={userInput}
              correctAnswer={currentWord.word}
            />
          )}

          {/* Action Buttons */}
          <Layout style={styles.buttonRow}>
            <Button
              style={styles.hintButton}
              accessoryLeft={HintIcon}
              appearance='outline'
              status='warning'
              onPress={() => setShowHint(true)}
              disabled={showFeedback}
            >
              Hint
            </Button>
            <Button
              style={styles.submitButton}
              status='success'
              onPress={checkAnswer}
              disabled={showFeedback || !userInput.trim()}
            >
              Submit
            </Button>
          </Layout>
        </Card>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  header: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 4,
  },
  gameCard: {
    borderRadius: 12,
    padding: 16,
  },
  speakButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  maskedHintContainer: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  maskedHint: {
    letterSpacing: 8,
    marginTop: 8,
  },
  hintText: {
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
    backgroundColor: '#FFF9C4',
    padding: 12,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  hintButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});

export default GameScreen;
