import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text, Card, Button, Icon } from '@ui-kitten/components';
import { RootStackParamList, Difficulty } from '../types';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const difficulties: { key: Difficulty; label: string; color: string; icon: string; desc: string }[] = [
  { key: 'simple', label: 'Simple', color: '#4CAF50', icon: 'star', desc: 'Easy words for beginners' },
  { key: 'medium', label: 'Medium', color: '#FF9800', icon: 'award', desc: 'Moderate challenge' },
  { key: 'hard', label: 'Hard', color: '#F44336', icon: 'flash', desc: 'Difficult words' },
  { key: 'veryHard', label: 'Very Hard', color: '#9C27B0', icon: 'trophy', desc: 'Expert level' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigation.navigate('Game', { difficulty });
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Text category='h1' style={styles.title}>🎯 Spelling Master</Text>
        <Text category='s1' style={styles.subtitle}>Choose your challenge</Text>
      </Layout>

      <Layout style={styles.cardsContainer}>
        {difficulties.map(({ key, label, icon, desc }) => (
          <Card
            key={key}
            style={styles.card}
            status={key === 'simple' ? 'success' : key === 'medium' ? 'warning' : key === 'hard' ? 'danger' : 'primary'}
            header={() => (
              <Layout style={styles.cardHeader}>
                <Icon name={icon} fill={key === 'simple' ? '#4CAF50' : key === 'medium' ? '#FF9800' : key === 'hard' ? '#F44336' : '#9C27B0'} style={styles.cardIcon} />
                <Text category='h5'>{label}</Text>
              </Layout>
            )}
          >
            <Text category='p2' style={styles.cardDesc}>{desc}</Text>
            <Button
              style={styles.playButton}
              size='small'
              onPress={() => handleDifficultySelect(key)}
            >
              Play Now
            </Button>
          </Card>
        ))}
      </Layout>

      <Layout style={styles.footer}>
        <Text category='c1' appearance='hint'>✨ Practice makes perfect!</Text>
      </Layout>
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
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#8F9BB3',
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    marginVertical: 6,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  cardIcon: {
    width: 28,
    height: 28,
  },
  cardDesc: {
    marginBottom: 12,
    color: '#8F9BB3',
  },
  playButton: {
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
});

export default HomeScreen;
