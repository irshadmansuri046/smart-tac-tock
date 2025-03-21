
import React from 'react';
import TicTacToeBoard from '../components/TicTacToeBoard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <header className="mb-12 text-center">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-2">Play a classic game</p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Tic Tac Toe</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Play the classic game of Tic Tac Toe against the computer. Choose your difficulty and try to win!
          </p>
        </header>
        
        <TicTacToeBoard />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Made with elegant simplicity.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
