import React from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Text, Card, Button, Icon } from '@ui-kitten/components';

interface FeedbackProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

const CheckIcon = (props: any) => (
  <Icon {...props} name='checkmark-circle-2' fill='#4CAF50' />
);

const CloseIcon = (props: any) => (
  <Icon {...props} name='close-circle' fill='#F44336' />
);

export const Feedback: React.FC<FeedbackProps> = ({ isCorrect, userAnswer, correctAnswer }) => {
  if (isCorrect) {
    return (
      <Card status='success' style={styles.card}>
        <Layout style={styles.correctContainer}>
          <Icon name='checkmark-circle-2' fill='#4CAF50' style={styles.icon} />
          <Text category='h5' status='success'>Correct!</Text>
          <Text category='s1'>+10 points</Text>
        </Layout>
      </Card>
    );
  }

  return (
    <Card status='danger' style={styles.card}>
      <Layout style={styles.wrongContainer}>
        <Icon name='close-circle' fill='#F44336' style={styles.icon} />
        <Text category='h6' status='danger'>Incorrect</Text>
        
        <Layout style={styles.answerContainer}>
          <Text category='s2' style={styles.yourAnswer}>
            Your answer:{' '}
            <Text style={styles.strikethrough}>{userAnswer}</Text>
          </Text>
          <Text category='s2' status='success'>
            Correct: {correctAnswer}
          </Text>
        </Layout>

        <Text category='c1' appearance='hint' style={styles.nextHint}>
          Next word in 2 seconds...
        </Text>
      </Layout>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: 8,
  },
  correctContainer: {
    alignItems: 'center',
    padding: 8,
  },
  wrongContainer: {
    alignItems: 'center',
    padding: 8,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  answerContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  yourAnswer: {
    marginBottom: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#F44336',
  },
  nextHint: {
    marginTop: 8,
  },
});

export default Feedback;
