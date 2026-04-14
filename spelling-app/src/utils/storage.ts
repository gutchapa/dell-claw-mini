import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, Difficulty } from '../types';

const STATS_KEY = '@spelling_master_stats';

export const loadStats = async (): Promise<UserStats | null> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveStats = async (stats: UserStats): Promise<void> => {
  try {
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
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

export const updateStats = (
  currentStats: UserStats,
  score: number,
  difficulty: Difficulty
): UserStats => {
  const newStats = { ...currentStats };
  newStats.totalGames += 1;
  newStats.totalScore += score;
  newStats.lastPlayed = new Date().toISOString();
  
  const diffStat = newStats.difficultyStats[difficulty];
  const newAvg = ((diffStat.avgScore * diffStat.gamesPlayed) + score) / (diffStat.gamesPlayed + 1);
  diffStat.gamesPlayed += 1;
  diffStat.avgScore = Math.round(newAvg);
  
  return newStats;
};
