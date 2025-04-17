import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { toast } from 'sonner';
import GameCell3D from './game/GameCell3D';

type Player = 'X' | 'O' | null;
type BoardState = Player[];
type GameStatus = 'playing' | 'won' | 'draw';

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
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerStats, setPlayerStats] = useState({
    wins: 0,
    losses: 0,
    draws: 0
  });

  // Check if there is a winner or a draw
  const checkGameStatus = (currentBoard: BoardState): { status: GameStatus; combination?: number[] } => {
    // Check for a winner
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

    // Check for a draw
    if (currentBoard.every(cell => cell !== null)) {
      return { status: 'draw' };
    }

    return { status: 'playing' };
  };

  // Make best move for computer
  const makeComputerMove = (currentBoard: BoardState): number => {
    // Find empty cells
    const emptyCells = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index): index is number => index !== null);

    if (emptyCells.length === 0) return -1;
    
    // Random move for easy difficulty
    if (difficulty === 'easy') {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    const computerSymbol: Player = 'O';
    const playerSymbol: Player = 'X';

    // Check if computer can win in one move
    for (const index of emptyCells) {
      const boardCopy = [...currentBoard];
      boardCopy[index] = computerSymbol;
      if (checkGameStatus(boardCopy).status === 'won') {
        return index;
      }
    }

    // Check if player can win in one move and block (medium and hard)
    for (const index of emptyCells) {
      const boardCopy = [...currentBoard];
      boardCopy[index] = playerSymbol;
      if (checkGameStatus(boardCopy).status === 'won') {
        return index;
      }
    }

    // Advanced strategy for hard difficulty
    if (difficulty === 'hard') {
      // Take center if available
      if (currentBoard[4] === null) {
        return 4;
      }
      
      // Take a corner if available
      const corners = [0, 2, 6, 8].filter(corner => currentBoard[corner] === null);
      if (corners.length > 0) {
        return corners[Math.floor(Math.random() * corners.length)];
      }
    }

    // Take a random available cell
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Handle player's move
  const handleCellClick = (index: number) => {
    // Prevent move if cell is already occupied or game is over
    if (board[index] !== null || gameStatus !== 'playing' || !isPlayerTurn) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X'; // Player is always X

    // Update board with player's move
    setBoard(newBoard);
    setIsPlayerTurn(false);

    // Check game status after player's move
    const result = checkGameStatus(newBoard);
    if (result.status !== 'playing') {
      handleGameEnd(result.status, result.combination, 'X');
      return;
    }
  };

  // Computer's turn logic
  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      // Add a small delay to make it feel more natural
      const timeoutId = setTimeout(() => {
        const computerMoveIndex = makeComputerMove(board);
        
        if (computerMoveIndex !== -1) {
          const newBoard = [...board];
          newBoard[computerMoveIndex] = 'O'; // Computer is always O
          setBoard(newBoard);
          
          // Check game status after computer's move
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

  // Handle game end (win or draw)
  const handleGameEnd = (status: GameStatus, combination?: number[], winner?: Player) => {
    setGameStatus(status);
    
    if (status === 'won' && combination) {
      setWinnerCombination(combination);
      
      // Update stats based on winner
      if (winner === 'X') { // Player won
        setPlayerStats(prev => ({ ...prev, wins: prev.wins + 1 }));
        toast.success("You won! 🎉");
      } else { // Computer won
        setPlayerStats(prev => ({ ...prev, losses: prev.losses + 1 }));
        toast.error("Computer won. Try again!");
      }
    } else if (status === 'draw') {
      setPlayerStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      toast.info("It's a draw!");
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setWinnerCombination([]);
  };

  // Check if a cell is part of the winning combination
  const isWinningCell = (index: number) => {
    return gameStatus === 'won' && winnerCombination.includes(index);
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="game-header">Tic Tac Toe</h1>
            <div className="flex gap-2">
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="text-sm bg-secondary rounded-full px-3 py-1 outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button className="game-button" onClick={resetGame}>
                New Game
              </button>
            </div>
          </div>
          
          <div className="bg-game-board rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3 aspect-square">
              {board.map((cell, index) => (
                <button
                  key={index}
                  className={`game-cell ${
                    cell === 'X' ? 'game-cell-player' : cell === 'O' ? 'game-cell-computer' : ''
                  } ${isWinningCell(index) ? 'bg-secondary/50' : ''}`}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || gameStatus !== 'playing' || !isPlayerTurn}
                  aria-label={`Cell ${index}`}
                >
                  <GameCell3D symbol={cell} />
                  {cell === null && <span className="opacity-0">_</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Wins</div>
            <div className="text-2xl font-medium text-game-player">{playerStats.wins}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Draws</div>
            <div className="text-2xl font-medium">{playerStats.draws}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Losses</div>
            <div className="text-2xl font-medium text-game-computer">{playerStats.losses}</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center animate-appear">
          {gameStatus === 'playing' ? (
            isPlayerTurn ? 
              "Your turn (X)" : 
              "Computer is thinking... (O)"
          ) : gameStatus === 'won' ? (
            winnerCombination[0] !== undefined && board[winnerCombination[0]] === 'X' ?
              "You won!" :
              "Computer won!"
          ) : (
            "It's a draw!"
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToeBoard;
