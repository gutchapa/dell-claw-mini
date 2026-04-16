import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, Text } from '@ui-kitten/components';
import { RootStackParamList, Difficulty, UserProfile } from '../types';
import { loadProfiles } from '../utils/storage';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const difficulties: { key: Difficulty; label: string; color: string; shadowColor: string; emoji: string; desc: string }[] = [
  { key: 'simple', label: 'SIMPLE', color: '#58CC02', shadowColor: '#46A302', emoji: '🌱', desc: 'Starting out!' },
  { key: 'medium', label: 'MEDIUM', color: '#1CB0F6', shadowColor: '#1899D6', emoji: '🌟', desc: 'Getting better!' },
  { key: 'hard', label: 'HARD', color: '#FFC800', shadowColor: '#E5B400', emoji: '🔥', desc: 'Challenge!' },
  { key: 'veryHard', label: 'EXPERT', color: '#FF4B4B', shadowColor: '#EA2B2B', emoji: '🏆', desc: 'Mastery!' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const { profileId } = route.params;
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const profiles = await loadProfiles();
      const p = profiles.find(p => p.id === profileId);
      if (p) setProfile(p);
    };
    getProfile();
  }, [profileId]);

  const handleDifficultySelect = (difficulty: Difficulty) => {
    navigation.navigate('Game', { difficulty, profileId });
  };

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileSelection')} style={styles.backToProfiles}>
            <Text style={styles.backEmoji}>👤</Text>
            <Text style={styles.backText}>Switch Student</Text>
          </TouchableOpacity>
          <View style={styles.statsBadge}>
            <Text style={styles.xpEmoji}>✨</Text>
            <Text style={styles.xpText}>{profile?.stats.totalScore || 0}</Text>
          </View>
        </View>

        <View style={styles.header}>
          <View style={styles.owlContainer}>
            <Text style={styles.owl}>{profile?.avatar || '🦉'}</Text>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>Hi {profile?.name || 'there'}! Ready for a lesson?</Text>
            </View>
          </View>
        </View>

        <View style={styles.pathContainer}>
          {difficulties.map(({ key, label, color, shadowColor, emoji, desc }) => (
            <View key={key} style={styles.levelWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDifficultySelect(key)}
                style={[styles.duoButton, { backgroundColor: color, borderBottomColor: shadowColor }]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
              <View style={styles.levelInfo}>
                <Text style={styles.levelLabel}>{label}</Text>
                <Text style={styles.levelDesc}>{desc}</Text>
              </View>
            </View>
          ))}
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
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 50,
  },
  topNav: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  backToProfiles: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  backEmoji: {
    fontSize: 18,
    marginRight: 5,
  },
  backText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#777777',
  },
  statsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4D1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD966',
  },
  xpEmoji: {
    fontSize: 18,
    marginRight: 5,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E5B400',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  owlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    width: '100%',
  },
  owl: {
    fontSize: 50,
    marginRight: 15,
  },
  bubble: {
    flex: 1,
  },
  bubbleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4B4B4B',
  },
  pathContainer: {
    width: '100%',
    gap: 30,
  },
  levelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  duoButton: {
    width: 80,
    height: 75,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 6,
    elevation: 5,
  },
  emoji: {
    fontSize: 35,
  },
  levelInfo: {
    marginLeft: 20,
    flex: 1,
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4B4B4B',
  },
  levelDesc: {
    fontSize: 16,
    color: '#777777',
    fontWeight: '600',
  },
});

export default HomeScreen;
