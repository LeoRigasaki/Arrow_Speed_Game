import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ArrowIconProps {
  direction: Direction;
  isCorrect?: boolean | null;
  className?: string; // Accept additional class names
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction, isCorrect, className: additionalClassName }) => {
  const Icon = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
  }[direction];

  let className = 'w-8 h-8 transition-transform duration-300';
  if (isCorrect === true) className += ' text-green-500 transform scale-125';
  if (isCorrect === false) className += ' text-red-500 animate-shake';

  if (additionalClassName) className += ` ${additionalClassName}`;

  return <Icon className={className} />;
};

export default ArrowIcon;
