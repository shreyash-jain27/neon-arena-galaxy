
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';

const NeonRacerX = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(2); // 0-4 (5 lanes)
  const [obstacles, setObstacles] = useState<{id: number, lane: number, y: number}[]>([]);
  const [speed, setSpeed] = useState(5);
  const gameLoopRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setSpeed(5);
    setPlayerPosition(2);
    
    let lastTimestamp = 0;
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      
      // Update every 16ms (60fps)
      if (deltaTime > 16) {
        // Add obstacles
        if (Math.random() > 0.95) {
          const lane = Math.floor(Math.random() * 5);
          setObstacles(prev => [...prev, { id: Date.now(), lane, y: 0 }]);
        }
        
        // Move obstacles
        setObstacles(prev => {
          const newObstacles = prev
            .map(obstacle => ({ ...obstacle, y: obstacle.y + (speed / 10) }))
            .filter(obstacle => obstacle.y < 100);
            
          // Check collisions
          const collision = newObstacles.some(
            obstacle => obstacle.lane === playerPosition && obstacle.y > 75 && obstacle.y < 85
          );
          
          if (collision) {
            setGameOver(true);
            
            // Update progress
            const progress = updateGameProgress('neon-racer-x', score);
            
            toast({
              title: "Game Over!",
              description: `Your score: ${score}. You earned 50 XP!`,
            });
            
            return newObstacles;
          }
          
          return newObstacles;
        });
        
        // Increase score
        setScore(prev => prev + 1);
        
        // Increase speed gradually
        if (score > 0 && score % 500 === 0) {
          setSpeed(prev => Math.min(prev + 1, 15));
        }
        
        lastTimestamp = timestamp;
      }
      
      if (!gameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };
  
  useEffect(() => {
    if (gameOver && gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
  }, [gameOver]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setPlayerPosition(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
        case 'd':
          setPlayerPosition(prev => Math.min(4, prev + 1));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);
  
  return (
    <div className="w-full h-full relative bg-gaming-darker rounded-lg overflow-hidden">
      {!gameStarted || gameOver ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4 text-neon-blue">
            {gameOver ? 'Game Over!' : 'Neon Racer X'}
          </h2>
          
          {gameOver && (
            <div className="mb-6 text-center">
              <p className="text-white text-lg mb-2">Your score: {score}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Navigate your racer through neon-lit streets. Use left/right arrow keys or A/D to change lanes.
            </p>
          )}
          
          <button 
            onClick={startGame}
            className="px-6 py-3 bg-neon-blue rounded-full text-white font-medium hover:bg-neon-blue/80 transition-colors"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative bg-gray-900">
          {/* Score and speed display */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Score: {score}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Speed: {speed}
          </div>
          
          {/* Road */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3, 4].map(lane => (
              <div key={lane} className="flex-1 h-full border-x border-gray-700 relative">
                {/* Lane markers */}
                {Array.from({ length: 20 }).map((_, index) => (
                  <div 
                    key={index}
                    className="absolute left-1/2 w-2 h-10 bg-yellow-400 transform -translate-x-1/2"
                    style={{ top: `${(index * 10) - 10}%` }}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute w-8 h-8 bg-red-500 rounded-sm transform -translate-x-1/2"
              style={{ 
                left: `${(obstacle.lane * 20) + 10}%`, 
                top: `${obstacle.y}%`
              }}
            />
          ))}
          
          {/* Player */}
          <div 
            className="absolute w-10 h-16 bg-neon-blue rounded shadow-neon transform -translate-x-1/2"
            style={{ 
              left: `${(playerPosition * 20) + 10}%`, 
              bottom: '15%'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NeonRacerX;
