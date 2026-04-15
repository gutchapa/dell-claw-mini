import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FeedbackProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, userAnswer, correctAnswer }) => {
  return (
    <View style={styles.container}>
      {isCorrect ? (
        <Text style={styles.correctText}>✅ Correct!</Text>
      ) : (
        <View style={styles.wrongContainer}>
          <Text style={styles.wrongAnswerText}>
            Your answer: ❌ {userAnswer || '(empty)'}
          </Text>
          <Text style={styles.correctAnswerText}>
            Correct: ✅ {correctAnswer}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  correctText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  wrongContainer: {
    alignItems: 'center',
  },
  wrongAnswerText: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: '600',
    marginBottom: 8,
  },
  correctAnswerText: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default Feedback;