import { Difficulty, Word } from '../types';

// Helper to generate masked hint: "F_X_" for "FIRE"
function generateMaskedHint(word: string, difficulty: Difficulty): string {
  const len = word.length;
  let showCount: number;
  
  switch (difficulty) {
    case 'simple':
      showCount = Math.max(1, Math.floor(len * 0.5)); // Show 50% of letters
      break;
    case 'medium':
      showCount = Math.max(1, Math.floor(len * 0.4)); // Show 40% of letters
      break;
    case 'hard':
      showCount = Math.max(1, Math.floor(len * 0.3)); // Show 30% of letters
      break;
    case 'veryHard':
      showCount = Math.max(1, Math.floor(len * 0.25)); // Show 25% of letters
      break;
    default:
      showCount = 1;
  }
  
  // Always show first letter, then alternate showing/hiding
  let result = word[0]; // First letter always shown
  
  for (let i = 1; i < len; i++) {
    // Show letter if it's in a position we want to reveal
    if (i < showCount || (i % 2 === 0 && i < showCount * 2)) {
      result += word[i];
    } else {
      result += '_';
    }
  }
  
  return result;
}

const rawWords: { word: string; hint: string; difficulty: Difficulty }[] = [
  // Simple
  { word: 'cat', hint: 'A furry pet that meows', difficulty: 'simple' },
  { word: 'dog', hint: 'A loyal pet that barks', difficulty: 'simple' },
  { word: 'sun', hint: 'The star that gives us light', difficulty: 'simple' },
  { word: 'book', hint: 'You read stories in this', difficulty: 'simple' },
  { word: 'tree', hint: 'Has leaves and branches', difficulty: 'simple' },
  { word: 'happy', hint: 'Feeling good', difficulty: 'simple' },
  { word: 'school', hint: 'Place where you learn', difficulty: 'simple' },
  { word: 'friend', hint: 'Someone you play with', difficulty: 'simple' },
  { word: 'water', hint: 'You drink when thirsty', difficulty: 'simple' },
  { word: 'family', hint: 'People who love you', difficulty: 'simple' },
  
  // Medium
  { word: 'beautiful', hint: 'Very pretty', difficulty: 'medium' },
  { word: 'elephant', hint: 'Large animal with trunk', difficulty: 'medium' },
  { word: 'bicycle', hint: 'Two-wheeled vehicle', difficulty: 'medium' },
  { word: 'library', hint: 'Place with many books', difficulty: 'medium' },
  { word: 'mountain', hint: 'Very tall hill', difficulty: 'medium' },
  { word: 'umbrella', hint: 'Protects from rain', difficulty: 'medium' },
  { word: 'butterfly', hint: 'Colorful flying insect', difficulty: 'medium' },
  { word: 'chocolate', hint: 'Sweet brown treat', difficulty: 'medium' },
  { word: 'dinosaur', hint: 'Extinct reptile', difficulty: 'medium' },
  { word: 'calendar', hint: 'Shows days and months', difficulty: 'medium' },
  
  // Hard
  { word: 'extraordinary', hint: 'Very unusual', difficulty: 'hard' },
  { word: 'environment', hint: 'Natural world', difficulty: 'hard' },
  { word: 'communication', hint: 'Sharing information', difficulty: 'hard' },
  { word: 'responsibility', hint: 'Being accountable', difficulty: 'hard' },
  { word: 'imagination', hint: 'Ability to create ideas', difficulty: 'hard' },
  { word: 'curiosity', hint: 'Desire to learn', difficulty: 'hard' },
  { word: 'perseverance', hint: 'Continuing despite difficulty', difficulty: 'hard' },
  { word: 'concentration', hint: 'Focusing attention', difficulty: 'hard' },
  { word: 'determination', hint: 'Firm purpose', difficulty: 'hard' },
  { word: 'vocabulary', hint: 'Collection of words', difficulty: 'hard' },
  
  // Very Hard
  { word: 'pneumonia', hint: 'Lung infection', difficulty: 'veryHard' },
  { word: 'rhythm', hint: 'Pattern of sounds', difficulty: 'veryHard' },
  { word: 'hierarchy', hint: 'System of ranking', difficulty: 'veryHard' },
  { word: 'conscience', hint: 'Inner sense of right', difficulty: 'veryHard' },
  { word: 'ambiguous', hint: 'Multiple meanings', difficulty: 'veryHard' },
  { word: 'phenomenon', hint: 'Observable event', difficulty: 'veryHard' },
  { word: 'idiosyncrasy', hint: 'Unique characteristic', difficulty: 'veryHard' },
  { word: 'accommodate', hint: 'Provide space for', difficulty: 'veryHard' },
  { word: 'occasionally', hint: 'Now and then', difficulty: 'veryHard' },
  { word: 'acknowledge', hint: 'Recognize existence', difficulty: 'veryHard' },
];

// Generate Word objects with masked hints
export const wordDatabase: Record<Difficulty, Word[]> = {
  simple: [],
  medium: [],
  hard: [],
  veryHard: [],
};

rawWords.forEach(w => {
  const wordWithMask: Word = {
    word: w.word,
    hint: w.hint,
    maskedHint: generateMaskedHint(w.word, w.difficulty),
    difficulty: w.difficulty,
  };
  wordDatabase[w.difficulty].push(wordWithMask);
});

export const getRandomWords = (difficulty: Difficulty, count: number): Word[] => {
  const words = wordDatabase[difficulty];
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, words.length));
};
