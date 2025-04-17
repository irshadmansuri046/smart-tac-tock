
export type Player = 'X' | 'O' | null;
export type BoardState = Player[];
export type GameStatus = 'playing' | 'won' | 'draw';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
}
