import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as Speech from 'expo-speech';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, WrongWord } from '../types';

type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, 'Results'>;

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const { score, totalWords, wrongWords, difficulty } = route.params;

  const percentage = Math.round((score / (totalWords * 10)) * 100);
  const correctCount = totalWords - wrongWords.length;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return '🏆 Excellent!';
    if (percentage >= 70) return '🌟 Great job!';
    if (percentage >= 50) return '👍 Good effort!';
    return '💪 Keep practicing!';
  };

  const speakWord = useCallback((word: string) => {
    Speech.stop();
    Speech.speak(word, { rate: 0.7 });
  }, []);

  const handlePracticeWrongWords = () => {
    if (wrongWords.length > 0) {
      const wordsToPractice = wrongWords.map(ww => ww.word);
      navigation.navigate('Game', { difficulty, practiceWords: wordsToPractice });
    }
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎉 Game Over!</Text>
      <Text style={styles.performance}>{getPerformanceMessage()}</Text>

      {/* Score Section */}
      <View style={styles.scoreCard}>
        <Text style={styles.scorePercentage}>{percentage}%</Text>
        <Text style={styles.scoreDetails}>
          {correctCount}/{totalWords} correct
        </Text>
        <Text style={styles.scorePoints}>Total Points: {score}</Text>
      </View>

      {/* Wrong Words Section */}
      {wrongWords.length > 0 && (
        <View style={styles.wrongWordsSection}>
          <Text style={styles.sectionTitle}>Words to Review</Text>
          
          {wrongWords.map((item, index) => (
            <View key={index} style={styles.wrongWordCard}>
              <View style={styles.wordRow}>
                <Text style={styles.correctWord}>{item.word.word}</Text>
                <TouchableOpacity
                  style={styles.hearButton}
                  onPress={() => speakWord(item.word.word)}
                >
                  <Text style={styles.hearButtonText}>🔊</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.userAnswer}>
                Your answer: {item.userAnswer || '(empty)'}
              </Text>
              
              <View style={styles.hintContainer}>
                <Text style={styles.hintLabel}>💡 Hint:</Text>
                <Text style={styles.hintText}>{item.word.hint}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {wrongWords.length > 0 && (
          <TouchableOpacity
            style={styles.practiceButton}
            onPress={handlePracticeWrongWords}
          >
            <Text style={styles.practiceButtonText}>
              🔄 Practice Wrong Words
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  performance: {
    fontSize: 24,
    textAlign: 'center',
    color: '#6200ee',
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scorePercentage: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreDetails: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  scorePoints: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  wrongWordsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  wrongWordCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    elevation: 2,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  correctWord: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  userAnswer: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 10,
  },
  hearButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  hearButtonText: {
    fontSize: 20,
  },
  hintContainer: {
    backgroundColor: '#fff9c4',
    padding: 10,
    borderRadius: 8,
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  hintText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 10,
  },
  practiceButton: {
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  practiceButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#6200ee',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ResultsScreen;