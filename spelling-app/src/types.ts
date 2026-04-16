export type Difficulty = 'simple' | 'medium' | 'hard' | 'veryHard';

export interface Word {
  word: string;
  hint: string;
  maskedHint: string;
  difficulty: Difficulty;
}

export interface WrongWord {
  word: Word;
  userAnswer: string;
}

export interface UserStats {
  totalGames: number;
  totalScore: number;
  bestStreak: number;
  lastPlayed: string;
  difficultyStats: Record<Difficulty, {
    gamesPlayed: number;
    avgScore: number;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // Emoji for now
  stats: UserStats;
}

export type RootStackParamList = {
  ProfileSelection: undefined;
  Home: { profileId: string };
  Game: { difficulty: Difficulty; profileId: string; practiceWords?: Word[] };
  Results: { score: number; totalWords: number; wrongWords: WrongWord[]; difficulty: Difficulty; profileId: string };
};
