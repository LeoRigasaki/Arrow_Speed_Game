import React from 'react';

interface Score {
  difficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'classic' | 'timeAttack' | 'survival';
  score: number;
  date: string;
}

interface HighScoresProps {
  highScores: Score[];
}

const HighScores: React.FC<HighScoresProps> = ({ highScores }) => {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">High Scores</h3>
      <ul className="list-disc list-inside">
        {highScores.map((highScore, index) => (
          <li key={index}>
            {highScore.difficulty} ({highScore.gameMode}): {highScore.score} (
            {new Date(highScore.date).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HighScores;
