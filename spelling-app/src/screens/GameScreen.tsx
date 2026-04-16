import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text } from '@ui-kitten/components';
import * as Speech from 'expo-speech';
import { RootStackParamList, Word, WrongWord } from '../types';
import { getRandomWords } from '../data/words';
import { updateProfileStats } from '../utils/storage';

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

export const GameScreen: React.FC<GameScreenProps> = ({ navigation, route }) => {
  const { difficulty, practiceWords, profileId } = route.params;
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [wrongWords, setWrongWords] = useState<WrongWord[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (practiceWords && practiceWords.length > 0) {
      setWords(practiceWords);
    } else {
      setWords(getRandomWords(difficulty, 10));
    }
  }, [difficulty, practiceWords]);

  const speakWord = useCallback(() => {
    if (words[currentIndex]) {
      Speech.stop();
      Speech.speak(words[currentIndex].word, { rate: 0.8 });
    }
  }, [words, currentIndex]);

  const checkAnswer = () => {
    if (!words[currentIndex] || showFeedback) return;

    const trimmedInput = userInput.trim().toLowerCase();
    const correctWord = words[currentIndex].word.toLowerCase();
    const correct = trimmedInput === correctWord;

    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore(s => s + 10);
    } else {
      setWrongWords(prev => [
        ...prev,
        { word: words[currentIndex], userAnswer: userInput.trim() },
      ]);
    }
  };

  const nextWord = async () => {
    if (currentIndex >= words.length - 1) {
      // Save stats to profile
      await updateProfileStats(profileId, score, difficulty);
      
      navigation.navigate('Results', {
        score,
        totalWords: words.length,
        wrongWords,
        difficulty,
        profileId
      });
    } else {
      setCurrentIndex(i => i + 1);
      setUserInput('');
      setShowFeedback(false);
      setShowHint(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex) / words.length) * 100 : 0;

  return (
    <Layout style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.instruction}>Write this in English</Text>
          
          <View style={styles.audioRow}>
            <View style={styles.audioButtons}>
              <TouchableOpacity onPress={speakWord} style={styles.speakerButton}>
                <Text style={styles.speakerEmoji}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setShowHint(true)} 
                style={[styles.speakerButton, styles.hintToggleButton]}
                disabled={showFeedback}
              >
                <Text style={styles.speakerEmoji}>💡</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.hintBubble}>
              <Text style={styles.hintText}>{currentWord?.maskedHint}</Text>
              {showHint && (
                <View style={styles.textHintContainer}>
                  <Text style={styles.textHint}>{currentWord?.hint}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Type your answer"
              value={userInput}
              onChangeText={setUserInput}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!showFeedback}
              onSubmitEditing={checkAnswer}
            />
          </View>
        </ScrollView>

        {/* Footer / Feedback */}
        <View style={[
          styles.footer,
          showFeedback && (isCorrect ? styles.footerCorrect : styles.footerIncorrect)
        ]}>
          {showFeedback ? (
            <View style={styles.feedbackContent}>
              <View style={styles.feedbackTextRow}>
                <View style={[styles.feedbackIcon, { backgroundColor: isCorrect ? '#58CC02' : '#FF4B4B' }]}>
                  <Text style={styles.feedbackIconText}>{isCorrect ? '✓' : '✕'}</Text>
                </View>
                <View>
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#58CC02' : '#FF4B4B' }]}>
                    {isCorrect ? 'Amazing!' : 'Correct solution:'}
                  </Text>
                  {!isCorrect && (
                    <Text style={styles.correctSolution}>{currentWord?.word}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={nextWord}
                style={[styles.actionButton, { backgroundColor: isCorrect ? '#58CC02' : '#FF4B4B', borderBottomColor: isCorrect ? '#46A302' : '#EA2B2B' }]}
              >
                <Text style={styles.actionButtonText}>CONTINUE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={checkAnswer}
              disabled={!userInput.trim()}
              style={[
                styles.actionButton,
                !userInput.trim() ? styles.buttonDisabled : { backgroundColor: '#58CC02', borderBottomColor: '#46A302' }
              ]}
            >
              <Text style={styles.actionButtonText}>CHECK</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    marginRight: 15,
  },
  closeText: {
    fontSize: 24,
    color: '#AFAFAF',
    fontWeight: 'bold',
  },
  progressBackground: {
    flex: 1,
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 8,
  },
  content: {
    padding: 24,
  },
  instruction: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 40,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  audioButtons: {
    gap: 10,
  },
  speakerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1CB0F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1899D6',
  },
  hintToggleButton: {
    backgroundColor: '#FFC800',
    borderBottomColor: '#E5B400',
  },
  speakerEmoji: {
    fontSize: 30,
  },
  hintBubble: {
    marginLeft: 20,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    flex: 1,
    minHeight: 130,
    justifyContent: 'center',
  },
  hintText: {
    fontSize: 22,
    letterSpacing: 4,
    color: '#4B4B4B',
    fontWeight: '700',
    textAlign: 'center',
  },
  textHintContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  textHint: {
    fontSize: 16,
    color: '#777777',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    minHeight: 150,
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    padding: 15,
  },
  input: {
    fontSize: 20,
    color: '#4B4B4B',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
  },
  footerCorrect: {
    backgroundColor: '#E5FFD1',
    borderTopColor: '#A5ED6E',
  },
  footerIncorrect: {
    backgroundColor: '#FFDFE0',
    borderTopColor: '#FF4B4B',
  },
  feedbackContent: {
    gap: 20,
  },
  feedbackTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  feedbackIconText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  feedbackTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  correctSolution: {
    fontSize: 18,
    color: '#FF4B4B',
    fontWeight: '700',
  },
  actionButton: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  buttonDisabled: {
    backgroundColor: '#E5E5E5',
    borderBottomWidth: 0,
  },
});

export default GameScreen;
