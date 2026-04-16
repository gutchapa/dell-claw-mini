import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, Difficulty, UserProfile } from '../types';

const PROFILES_KEY = '@spelling_master_profiles';

export const loadProfiles = async (): Promise<UserProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(PROFILES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProfiles = async (profiles: UserProfile[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // Handle error silently
  }
};

export const createInitialStats = (): UserStats => ({
  totalGames: 0,
  totalScore: 0,
  bestStreak: 0,
  lastPlayed: new Date().toISOString(),
  difficultyStats: {
    simple: { gamesPlayed: 0, avgScore: 0 },
    medium: { gamesPlayed: 0, avgScore: 0 },
    hard: { gamesPlayed: 0, avgScore: 0 },
    veryHard: { gamesPlayed: 0, avgScore: 0 },
  },
});

export const updateProfileStats = async (
  profileId: string,
  score: number,
  difficulty: Difficulty
): Promise<void> => {
  const profiles = await loadProfiles();
  const profileIndex = profiles.findIndex(p => p.id === profileId);
  
  if (profileIndex === -1) return;

  const profile = profiles[profileIndex];
  const stats = profile.stats;

  stats.totalGames += 1;
  stats.totalScore += score;
  stats.lastPlayed = new Date().toISOString();
  
  const diffStat = stats.difficultyStats[difficulty];
  const newAvg = ((diffStat.avgScore * diffStat.gamesPlayed) + score) / (diffStat.gamesPlayed + 1);
  diffStat.gamesPlayed += 1;
  diffStat.avgScore = Math.round(newAvg);

  profiles[profileIndex] = { ...profile, stats };
  await saveProfiles(profiles);
};
