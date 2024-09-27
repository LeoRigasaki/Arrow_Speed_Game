import React from 'react';
import ArrowIcon from '@/components/ui/ArrowIcon';

type Direction = 'up' | 'down' | 'left' | 'right';

interface GameBoardProps {
  sequence: Direction[];
  userInput: Direction[];
}

const GameBoard: React.FC<GameBoardProps> = ({ sequence, userInput }) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      {sequence.map((direction, index) => (
        <ArrowIcon
          key={index}
          direction={direction}
          isCorrect={userInput[index] === undefined ? null : userInput[index] === direction}
        />
      ))}
    </div>
  );
};

export default GameBoard;
