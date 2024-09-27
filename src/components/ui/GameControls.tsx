import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'classic' | 'timeAttack' | 'survival';

interface GameControlsProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  gameMode: GameMode;
  setGameMode: (gameMode: GameMode) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
}) => {
  return (
    <div className="mb-4 space-y-2">
      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
      <Select value={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
        <SelectTrigger>
          <SelectValue placeholder="Select game mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="classic">Classic</SelectItem>
          <SelectItem value="timeAttack">Time Attack</SelectItem>
          <SelectItem value="survival">Survival</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GameControls;
