import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Shuffle } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type PowerUp = 'slowTime' | 'doublePoints' | 'shuffle';

interface Level {
  length: number;
  time: number;
}

interface GameStatsProps {
  timer: number;
  score: number;
  streak: number;
  combo: number;
  lives: number;
  gameMode: 'classic' | 'timeAttack' | 'survival';
  difficulty: Difficulty;
  levels: Record<Difficulty, Level>;
  activePowerUp: PowerUp | null;
}

const GameStats: React.FC<GameStatsProps> = ({
  timer,
  score,
  streak,
  combo,
  lives,
  gameMode,
  difficulty,
  levels,
  activePowerUp,
}) => {
  return (
    <div className="mt-4">
      <Progress value={(timer / levels[difficulty].time) * 100} className="w-full mb-2" />
      <div className="flex justify-between">
        <p>Time: {timer}s</p>
        <p>Score: {score}</p>
      </div>
      <div className="flex justify-between">
        <p>
          Streak: {streak} {streak >= 5 && '🔥'}
        </p>
        <p>Combo: x{1 + Math.floor(combo / 5)}</p>
      </div>
      {gameMode === 'survival' && (
        <p>
          Lives:{' '}
          {[...Array(lives)].map((_, i) => (
            <span key={i}>❤️</span>
          ))}
        </p>
      )}
      {activePowerUp && (
        <Badge className="mt-2" variant="secondary">
          {activePowerUp === 'slowTime' && <Clock className="w-4 h-4 mr-1" />}
          {activePowerUp === 'doublePoints' && <Target className="w-4 h-4 mr-1" />}
          {activePowerUp === 'shuffle' && <Shuffle className="w-4 h-4 mr-1" />}
          {activePowerUp}
        </Badge>
      )}
    </div>
  );
};

export default GameStats;
