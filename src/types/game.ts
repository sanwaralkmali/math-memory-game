export interface GamePair {
  pair: [string, string];
}

export interface SkillData {
  title: string;
  description: string;
  questions: GamePair[];
  hasDashboard?: boolean;
  gameConfig?: {
    gridSize?: 'small' | 'medium' | 'large';
    timeLimit?: number;
    allowHints?: boolean;
  };
}

export interface GameCard {
  id: string;
  content: string;
  pairId: string;
  iconId: number; // Icon identifier (1-15)
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: GameCard[];
  selectedCards: string[];
  score: number;
  moves: number;
  isComplete: boolean;
  timeElapsed: number;
}

export interface PlayerState {
  name: string;
  score: number;
  moves: number;
  timeElapsed: number;
  matches: number;
}

export interface BattleGameState {
  cards: GameCard[];
  selectedCards: string[];
  isComplete: boolean;
  currentPlayer: 0 | 1;
  players: [PlayerState, PlayerState];
}

export type GameMode = 'easy' | 'medium' | 'hard';
export type GameDifficulty = 'beginner' | 'intermediate' | 'advanced';