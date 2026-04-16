import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text } from '@ui-kitten/components';
import { RootStackParamList } from '../types';

type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, 'Results'>;

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation, route }) => {
  const { score, totalWords, wrongWords, difficulty, profileId } = route.params;

  const percentage = Math.round(((totalWords - wrongWords.length) / totalWords) * 100);

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Lesson Complete!</Text>
        
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#FFC800', borderBottomColor: '#E5B400' }]}>
            <Text style={styles.statEmoji}>✨</Text>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#58CC02', borderBottomColor: '#46A302' }]}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>{percentage}%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </View>
        </View>

        {wrongWords.length > 0 && (
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Words to practice</Text>
            {wrongWords.map((item, index) => (
              <View key={index} style={styles.wrongWordRow}>
                <Text style={styles.wrongWordText}>{item.word.word}</Text>
                <Text style={styles.wrongWordUser}>{item.userAnswer || '(empty)'}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {wrongWords.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Game', { difficulty, profileId, practiceWords: wrongWords.map(w => w.word) })}
              style={[styles.duoButton, { backgroundColor: '#1CB0F6', borderBottomColor: '#1899D6' }]}
            >
              <Text style={styles.duoButtonText}>PRACTICE MISTAKES</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Home', { profileId })}
            style={[styles.duoButton, { backgroundColor: '#58CC02', borderBottomColor: '#46A302' }]}
          >
            <Text style={styles.duoButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#58CC02',
    marginBottom: 40,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    borderBottomWidth: 5,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  reviewSection: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginBottom: 30,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4B4B4B',
    marginBottom: 15,
  },
  wrongWordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  wrongWordText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#58CC02',
  },
  wrongWordUser: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4B4B',
    textDecorationLine: 'line-through',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  duoButton: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 5,
  },
  duoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});

export default ResultsScreen;
