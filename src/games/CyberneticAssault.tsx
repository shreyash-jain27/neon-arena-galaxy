
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';

const CyberneticAssault = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [enemies, setEnemies] = useState<{ id: number; x: number; y: number }[]>([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const { toast } = useToast();
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setEnemies([]);
    
    // Start the game loop
    const gameInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Spawn new enemy
        setEnemies(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            x: Math.floor(Math.random() * 90), 
            y: 0 
          }
        ]);
      }
      
      // Move enemies down
      setEnemies(prev => 
        prev
          .map(enemy => ({ ...enemy, y: enemy.y + 1 }))
          .filter(enemy => enemy.y < 90) // Remove enemies that go off screen
      );
      
      // Check for collisions
      setEnemies(prev => {
        const collidedEnemy = prev.find(enemy => 
          Math.abs(enemy.x - playerPosition.x) < 5 && 
          Math.abs(enemy.y - playerPosition.y) < 5
        );
        
        if (collidedEnemy) {
          clearInterval(gameInterval);
          setGameOver(true);
          
          // Update progress
          const progress = updateGameProgress('cybernetic-assault', score);
          
          toast({
            title: "Game Over!",
            description: `Your score: ${score}. You earned 50 XP!`,
          });
          
          return prev.filter(enemy => enemy.id !== collidedEnemy.id);
        }
        
        return prev;
      });
      
      // Increase score
      setScore(prev => prev + 1);
      
    }, 100);
    
    return () => clearInterval(gameInterval);
  };
  
  // Handle keyboard input for player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          setPlayerPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 5) }));
          break;
        case 'ArrowRight':
        case 'd':
          setPlayerPosition(prev => ({ ...prev, x: Math.min(95, prev.x + 5) }));
          break;
        case 'ArrowUp':
        case 'w':
          setPlayerPosition(prev => ({ ...prev, y: Math.max(0, prev.y - 5) }));
          break;
        case 'ArrowDown':
        case 's':
          setPlayerPosition(prev => ({ ...prev, y: Math.min(85, prev.y + 5) }));
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
          <h2 className="text-2xl font-bold mb-4 text-neon-purple">
            {gameOver ? 'Game Over!' : 'Cybernetic Assault'}
          </h2>
          
          {gameOver && (
            <div className="mb-6 text-center">
              <p className="text-white text-lg mb-2">Your score: {score}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Navigate through enemy cyborgs in this fast-paced action game. Use arrow keys or WASD to move.
            </p>
          )}
          
          <button 
            onClick={startGame}
            className="px-6 py-3 bg-neon-purple rounded-full text-white font-medium hover:bg-neon-purple/80 transition-colors"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Score display */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Score: {score}
          </div>
          
          {/* Player */}
          <div 
            className="absolute w-6 h-6 bg-neon-blue rounded-full shadow-neon"
            style={{ 
              left: `${playerPosition.x}%`, 
              top: `${playerPosition.y}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          />
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className="absolute w-4 h-4 bg-red-500 rounded-full"
              style={{ 
                left: `${enemy.x}%`, 
                top: `${enemy.y}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CyberneticAssault;
