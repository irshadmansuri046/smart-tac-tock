
import React from 'react';
import { GameStatus, Player } from './types';

interface GameStatusProps {
  gameStatus: GameStatus;
  isPlayerTurn: boolean;
  winningPlayer: Player;
}

const GameStatus = ({ gameStatus, isPlayerTurn, winningPlayer }: GameStatusProps) => {
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

export default GameStatus;
