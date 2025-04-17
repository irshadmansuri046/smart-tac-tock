import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Player, BoardState, GameStatus, GameDifficulty, PlayerStats } from './game/types';
import GameBoard from './game/GameBoard';
import GameControls from './game/GameControls';
import GameStats from './game/GameStats';
import GameStatus from './game/GameStatus';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

const TicTacToeBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winnerCombination, setWinnerCombination] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    wins: 0,
    losses: 0,
    draws: 0
  });

  const checkGameStatus = (currentBoard: BoardState): { status: GameStatus; combination?: number[] } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return { status: 'won', combination };
      }
    }

    if (currentBoard.every(cell => cell !== null)) {
      return { status: 'draw' };
    }

    return { status: 'playing' };
  };

  const makeComputerMove = (currentBoard: BoardState): number => {
    const emptyCells = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptyCells.length === 0) return -1;
    
    if (difficulty === 'easy') {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const computerSymbol: Player = 'O';
    const playerSymbol: Player = 'X';

    for (const index of emptyCells) {
      const boardCopy = [...currentBoard];
      boardCopy[index] = computerSymbol;
      if (checkGameStatus(boardCopy).status === 'won') {
        return index;
      }
    }

    for (const index of emptyCells) {
      const boardCopy = [...currentBoard];
      boardCopy[index] = playerSymbol;
      if (checkGameStatus(boardCopy).status === 'won') {
        return index;
      }
    }

    if (difficulty === 'hard') {
      if (currentBoard[4] === null) {
        return 4;
      }
      
      const corners = [0, 2, 6, 8].filter(corner => currentBoard[corner] === null);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const handleCellClick = (index: number) => {
    if (board[index] !== null || gameStatus !== 'playing' || !isPlayerTurn) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';

    setBoard(newBoard);
    setIsPlayerTurn(false);

    const result = checkGameStatus(newBoard);
    if (result.status !== 'playing') {
      handleGameEnd(result.status, result.combination, 'X');
      return;
    }
  };

  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      const timeoutId = setTimeout(() => {
        const computerMoveIndex = makeComputerMove(board);
        
        if (computerMoveIndex !== -1) {
          const newBoard = [...board];
          newBoard[computerMoveIndex] = 'O';
          setBoard(newBoard);
          
          const result = checkGameStatus(newBoard);
          if (result.status !== 'playing') {
            handleGameEnd(result.status, result.combination, 'O');
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 600);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isPlayerTurn, board, gameStatus, difficulty]);

  const handleGameEnd = (status: GameStatus, combination?: number[], winner?: Player) => {
    setGameStatus(status);
    
    if (status === 'won' && combination) {
      setWinnerCombination(combination);
      
      if (winner === 'X') {
        setPlayerStats(prev => ({ ...prev, wins: prev.wins + 1 }));
        toast.success("You won! 🎉");
      } else {
        setPlayerStats(prev => ({ ...prev, losses: prev.losses + 1 }));
        toast.error("Computer won. Try again!");
      }
    } else if (status === 'draw') {
      setPlayerStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      toast.info("It's a draw!");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setWinnerCombination([]);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="game-header">Tic Tac Toe</h1>
            <GameControls
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onNewGame={resetGame}
            />
          </div>
          
          <GameBoard
            board={board}
            winnerCombination={winnerCombination}
            gameStatus={gameStatus}
            isPlayerTurn={isPlayerTurn}
            onCellClick={handleCellClick}
          />
        </div>

        <GameStats stats={playerStats} />

        <GameStatus 
          gameStatus={gameStatus}
          isPlayerTurn={isPlayerTurn}
          winningPlayer={winnerCombination.length > 0 ? board[winnerCombination[0]] : null}
        />
      </div>
    </div>
  );
};

export default TicTacToeBoard;
