
import React from 'react';
import { GameStatus, Player } from './types';

interface GameStatusDisplayProps {
  gameStatus: GameStatus;
  isPlayerTurn: boolean;
  winningPlayer: Player;
}

const GameStatusDisplay = ({ gameStatus, isPlayerTurn, winningPlayer }: GameStatusDisplayProps) => {
  return (
    <div className="text-sm text-muted-foreground text-center animate-appear">
      {gameStatus === 'playing' ? (
        isPlayerTurn ? 
          "Your turn (X)" : 
          "Computer is thinking... (O)"
      ) : gameStatus === 'won' ? (
        winningPlayer === 'X' ?
          "You won!" :
          "Computer won!"
      ) : (
        "It's a draw!"
      )}
    </div>
  );
};

export default GameStatusDisplay;
