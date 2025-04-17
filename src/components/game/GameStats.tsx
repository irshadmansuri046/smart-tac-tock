
import React from 'react';
import { PlayerStats } from './types';

interface GameStatsProps {
  stats: PlayerStats;
}

const GameStats = ({ stats }: GameStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Wins</div>
        <div className="text-2xl font-medium text-game-player">{stats.wins}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Draws</div>
        <div className="text-2xl font-medium">{stats.draws}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground mb-1">Losses</div>
        <div className="text-2xl font-medium text-game-computer">{stats.losses}</div>
      </div>
    </div>
  );
};

export default GameStats;
