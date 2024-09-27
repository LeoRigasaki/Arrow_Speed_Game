"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import GameControls from '@/components/ui/GameControls';
import GameStats from '@/components/ui/GameStats';
import GameBoard from '@/components/ui/GameBoard';
import HighScores from '@/components/ui/HighScores';
import ArrowIcon from '@/components/ui/ArrowIcon'; // Import ArrowIcon for visual feedback

type Direction = 'up' | 'down' | 'left' | 'right';
type GameState = 'idle' | 'playing' | 'finished';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'classic' | 'timeAttack' | 'survival';
type PowerUp = 'slowTime' | 'doublePoints' | 'shuffle';

interface Level {
  length: number;
  time: number;
}

interface Score {
  difficulty: Difficulty;
  gameMode: GameMode;
  score: number;
  date: string;
}

const levels: Record<Difficulty, Level> = {
  easy: { length: 3, time: 30 },
  medium: { length: 5, time: 25 },
  hard: { length: 7, time: 20 },
};

const ArrowKeySpeedTest: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [sequence, setSequence] = useState<Direction[]>([]);
  const [userInput, setUserInput] = useState<Direction[]>([]);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(levels[difficulty].time);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [streak, setStreak] = useState(0);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);
  const [lives, setLives] = useState<number>(3);
  const [combo, setCombo] = useState(0);
  const [lastSwipe, setLastSwipe] = useState<Direction | null>(null); // New state for visual feedback
  const konami = useRef<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameEndedRef = useRef<boolean>(false);

  // Refs to hold latest state for event handlers
  const gameStateRef = useRef<GameState>(gameState);
  const sequenceRef = useRef<Direction[]>(sequence);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    sequenceRef.current = sequence;
  }, [sequence]);

  const generateSequence = useCallback((): Direction[] => {
    const directions: Direction[] = ['up', 'down', 'left', 'right'];
    return Array.from({ length: levels[difficulty].length }, () => directions[Math.floor(Math.random() * directions.length)]);
  }, [difficulty]);

  const shuffleSequence = useCallback(() => {
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence];
      for (let i = newSequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newSequence[i], newSequence[j]] = [newSequence[j], newSequence[i]];
      }
      return newSequence;
    });
  }, []);

  const startGame = () => {
    console.log('Game Started');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    gameEndedRef.current = false;

    setSequence(generateSequence());
    setUserInput([]);
    setGameState('playing');
    setScore(0);
    setTimer(levels[difficulty].time);
    setStreak(0);
    setIsEasterEggActive(false);
    setActivePowerUp(null);
    setLives(gameMode === 'survival' ? 3 : Infinity);
    setCombo(0);
  };

  const endGame = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;

    console.log('Game Ended');
    setGameState('finished');

    const newScore: Score = {
      difficulty,
      gameMode,
      score,
      date: new Date().toISOString(),
    };

    setHighScores((prevScores) => {
      const newScores = [...prevScores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem('arrowKeyHighScores', JSON.stringify(newScores));
      return newScores;
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [difficulty, gameMode, score]);

  useEffect(() => {
    const storedScores = localStorage.getItem('arrowKeyHighScores');
    if (storedScores) {
      setHighScores(JSON.parse(storedScores));
    }
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        if (gameEndedRef.current) {
          clearInterval(timerRef.current!);
          return;
        }

        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            if (gameEndedRef.current) return prevTimer;

            if (gameMode === 'timeAttack') {
              endGame();
            } else if (gameMode === 'survival') {
              setLives((prev) => prev - 1);
              return levels[difficulty].time;
            } else {
              endGame();
            }
            return 0;
          }
          return prevTimer - 1;
        });
      }, activePowerUp === 'slowTime' ? 1500 : 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, activePowerUp, endGame, gameMode, difficulty]);

  useEffect(() => {
    if (lives <= 0 && !gameEndedRef.current) {
      endGame();
    }
  }, [lives, endGame]);

  const handleCorrectInput = () => {
    const pointsEarned = (isEasterEggActive || activePowerUp === 'doublePoints' ? 2 : 1) * (1 + Math.floor(combo / 5));
    setScore((prevScore) => prevScore + pointsEarned);
    setStreak((prevStreak) => prevStreak + 1);
    setCombo((prevCombo) => prevCombo + 1);

    if (gameMode === 'timeAttack') {
      setTimer((prevTimer) => Math.min(prevTimer + 2, levels[difficulty].time));
    }
    if (Math.random() < 0.1) {
      const powerUps: PowerUp[] = ['slowTime', 'doublePoints', 'shuffle'];
      setActivePowerUp(powerUps[Math.floor(Math.random() * powerUps.length)]);
    }
  };

  const handleWrongInput = () => {
    if (gameEndedRef.current) return;

    setStreak(0);
    setCombo(0);
    if (gameMode === 'survival') {
      setLives((prev) => prev - 1);
    }
    if (activePowerUp === 'shuffle') {
      shuffleSequence();
    } else {
      setSequence(generateSequence());
    }
    setUserInput([]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameStateRef.current !== 'playing') return;

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
      };

      const direction = keyToDirection[event.key];
      if (direction) {
        setUserInput((prev) => {
          const newInput = [...prev, direction];
          const currentIndex = newInput.length - 1;

          if (direction !== sequenceRef.current[currentIndex]) {
            handleWrongInput();
            return [];
          } else if (newInput.length === sequenceRef.current.length) {
            handleCorrectInput();
            setSequence(generateSequence());
            return [];
          }

          return newInput;
        });
      }

      konami.current = [...konami.current, event.key].slice(-10);
      if (konami.current.join(',') === 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a') {
        setIsEasterEggActive(true);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (gameStateRef.current !== 'playing') return;
      const touch = event.changedTouches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;

      const handleTouchEnd = (endEvent: TouchEvent) => {
        const endTouch = endEvent.changedTouches[0];
        const deltaX = endTouch.clientX - startX;
        const deltaY = endTouch.clientY - startY;

        let direction: Direction | null = null;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 30 ? 'right' : deltaX < -30 ? 'left' : null;
        } else {
          direction = deltaY > 30 ? 'down' : deltaY < -30 ? 'up' : null;
        }

        if (direction) {
          setLastSwipe(direction); // Set the last swipe direction for visual feedback
          setTimeout(() => setLastSwipe(null), 500); // Clear after 500ms

          setUserInput((prev) => {
            const newInput = [...prev, direction as Direction];
            const currentIndex = newInput.length - 1;

            if (direction !== sequenceRef.current[currentIndex]) {
              handleWrongInput();
              return [];
            } else if (newInput.length === sequenceRef.current.length) {
              handleCorrectInput();
              setSequence(generateSequence());
              return [];
            }

            return newInput;
          });
        }

        window.removeEventListener('touchend', handleTouchEnd);
      };

      window.addEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [generateSequence, handleWrongInput, handleCorrectInput, shuffleSequence]);

  return (
    <Card className="p-6 max-w-md mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-center">Arrow Key Speed Test</h2>

      <GameControls
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        gameMode={gameMode}
        setGameMode={setGameMode}
      />

      <Button onClick={startGame} disabled={gameState === 'playing'} className="w-full">
        {gameState === 'idle' ? 'Start Game' : 'Restart'}
      </Button>

      {gameState !== 'idle' && (
        <>
          <GameStats
            timer={timer}
            score={score}
            streak={streak}
            combo={combo}
            lives={lives}
            gameMode={gameMode}
            difficulty={difficulty}
            levels={levels}
            activePowerUp={activePowerUp}
          />

          <GameBoard sequence={sequence} userInput={userInput} />
        </>
      )}

      {isEasterEggActive && (
        <Alert className="mt-4">
          <Zap className="h-4 w-4" />
          <AlertTitle>Easter Egg Activated!</AlertTitle>
          <AlertDescription>
            You've unlocked the secret Konami Code! Enjoy double points for the rest of the game!
          </AlertDescription>
        </Alert>
      )}

      {gameState === 'finished' && (
        <Alert className="mt-4">
          <AlertTitle>Game Over!</AlertTitle>
          <AlertDescription>Final Score: {score}</AlertDescription>
        </Alert>
      )}

      {highScores.length > 0 && <HighScores highScores={highScores} />}

      {/* Visual Feedback for Touch Inputs */}
      {lastSwipe && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ArrowIcon
            direction={lastSwipe}
            isCorrect={null}
            className="opacity-75 animate-pulse text-blue-500 text-6xl"
          />
        </div>
      )}
    </Card>
  );
};

export default ArrowKeySpeedTest;
