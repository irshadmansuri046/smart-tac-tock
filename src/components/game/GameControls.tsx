
import React from 'react';
import { GameDifficulty } from './types';

interface GameControlsProps {
  difficulty: GameDifficulty;
  onDifficultyChange: (difficulty: GameDifficulty) => void;
  onNewGame: () => void;
}

const GameControls = ({ difficulty, onDifficultyChange, onNewGame }: GameControlsProps) => {
  return (
    <div className="flex gap-2">
      <select 
        value={difficulty} 
        onChange={(e) => onDifficultyChange(e.target.value as GameDifficulty)}
        className="text-sm bg-secondary rounded-full px-3 py-1 outline-none focus:ring-1 focus:ring-ring"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button className="game-button" onClick={onNewGame}>
        New Game
      </button>
    </div>
  );
};

export default GameControls;
