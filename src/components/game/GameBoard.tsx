
import React from 'react';
import { BoardState, GameStatus } from './types';
import GameCell3D from './GameCell3D';

interface GameBoardProps {
  board: BoardState;
  winnerCombination: number[];
  gameStatus: GameStatus;
  isPlayerTurn: boolean;
  onCellClick: (index: number) => void;
}

const GameBoard = ({ 
  board, 
  winnerCombination, 
  gameStatus, 
  isPlayerTurn, 
  onCellClick 
}: GameBoardProps) => {
  const isWinningCell = (index: number) => {
    return gameStatus === 'won' && winnerCombination.includes(index);
  };

  return (
    <div className="bg-game-board rounded-2xl p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-3 aspect-square">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`game-cell ${
              cell === 'X' ? 'game-cell-player' : cell === 'O' ? 'game-cell-computer' : ''
            } ${isWinningCell(index) ? 'bg-secondary/50' : ''}`}
            onClick={() => onCellClick(index)}
            disabled={cell !== null || gameStatus !== 'playing' || !isPlayerTurn}
            aria-label={`Cell ${index}`}
          >
            <GameCell3D symbol={cell} />
            {cell === null && <span className="opacity-0">_</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
