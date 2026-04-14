import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type ResultsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({ navigation, route }: ResultsScreenProps) {
  const { score, total, difficulty } = route.params;
  const percentage = Math.round((score / total) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return '🏆 Outstanding!';
    if (percentage >= 75) return '🌟 Great job!';
    if (percentage >= 60) return '👍 Good effort!';
    return '💪 Keep practicing!';
  };

  const getColor = () => {
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 75) return '#8BC34A';
    if (percentage >= 60) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getMessage()}</Text>
      
      <View style={[styles.scoreCircle, { borderColor: getColor() }]}>
        <Text style={[styles.scoreText, { color: getColor() }]}>{percentage}%</Text>
        <Text style={styles.scoreDetail}>{score} / {total} points</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.difficultyText}>Level: {difficulty}</Text>
        <Text style={styles.feedbackText}>
          {percentage >= 75 
            ? 'You\'re ready for the next level!' 
            : 'Practice makes perfect. Try again!'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#6200ee' }]} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>🏠 Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#4CAF50', marginTop: 10 }]} 
        onPress={() => navigation.navigate('Game', { difficulty })}
      >
        <Text style={styles.buttonText}>🔄 Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 36, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  scoreCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  scoreText: { fontSize: 48, fontWeight: 'bold' },
  scoreDetail: { fontSize: 18, color: '#666', marginTop: 5 },
  statsContainer: { marginTop: 30, alignItems: 'center' },
  difficultyText: { fontSize: 20, color: '#666', marginBottom: 10 },
  feedbackText: { fontSize: 18, color: '#333', textAlign: 'center', fontStyle: 'italic' },
  button: { width: '100%', padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
