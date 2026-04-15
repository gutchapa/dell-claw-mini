export type Difficulty = 'simple' | 'medium' | 'hard' | 'veryHard';

export interface Word {
  word: string;
  hint: string;
  difficulty: Difficulty;
}

export interface WrongWord {
  word: Word;
  userAnswer: string;
}

export interface GameState {
  currentWordIndex: number;
  score: number;
  timeRemaining: number;
  streak: number;
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

export type RootStackParamList = {
  Home: undefined;
  Game: { difficulty: Difficulty; practiceWords?: Word[] };
  Results: { score: number; totalWords: number; wrongWords: WrongWord[]; difficulty: Difficulty };
};