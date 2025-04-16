
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';
import { Zap, Shield, Fuel } from 'lucide-react';

// Game constants
const GAME_SETTINGS = {
  INITIAL_SPEED: 5,
  MAX_SPEED: 20,
  SPEED_INCREMENT: 0.5,
  LANE_COUNT: 5,
  OBSTACLE_TYPES: ['car', 'barrier', 'oil'],
  POWERUP_TYPES: ['boost', 'shield', 'slowdown'],
  COIN_VALUE: 10,
  SHIELD_DURATION: 5000,
  BOOST_DURATION: 3000,
  SLOWDOWN_DURATION: 4000
};

// Game entities
interface Obstacle {
  id: number;
  lane: number;
  y: number;
  type: 'car' | 'barrier' | 'oil';
  width?: number;
}

interface PowerUp {
  id: number;
  lane: number;
  y: number;
  type: 'boost' | 'shield' | 'slowdown';
}

interface Coin {
  id: number;
  lane: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

const NeonRacerX = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(2); // 0-4 (5 lanes)
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [gameCoins, setGameCoins] = useState<Coin[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [speed, setSpeed] = useState(GAME_SETTINGS.INITIAL_SPEED);
  const [baseSpeed, setBaseSpeed] = useState(GAME_SETTINGS.INITIAL_SPEED);
  const [playerEffects, setPlayerEffects] = useState({
    shielded: false,
    boosted: false,
    slowed: false
  });
  
  // Performance optimization
  const gameLoopRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const keysPressed = useRef<{[key: string]: boolean}>({});
  const { toast } = useToast();

  // Create particles for visual effects
  const createParticles = useCallback((x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1, // Mostly upward
        size: Math.random() * 3 + 1,
        color,
        life: Math.random() * 30 + 20,
        maxLife: 50,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Apply power-up effect
  const applyPowerUp = useCallback((type: 'boost' | 'shield' | 'slowdown') => {
    switch (type) {
      case 'shield':
        setPlayerEffects(prev => ({ ...prev, shielded: true }));
        setTimeout(() => setPlayerEffects(prev => ({ ...prev, shielded: false })), GAME_SETTINGS.SHIELD_DURATION);
        toast({ description: "Shield activated! Protected from crashes for a short time." });
        break;
      case 'boost':
        setPlayerEffects(prev => ({ ...prev, boosted: true }));
        setSpeed(prev => prev * 1.5);
        setTimeout(() => {
          setPlayerEffects(prev => ({ ...prev, boosted: false }));
          setSpeed(baseSpeed);
        }, GAME_SETTINGS.BOOST_DURATION);
        toast({ description: "Speed boost activated!" });
        break;
      case 'slowdown':
        setPlayerEffects(prev => ({ ...prev, slowed: true }));
        setSpeed(prev => prev * 0.5);
        setTimeout(() => {
          setPlayerEffects(prev => ({ ...prev, slowed: false }));
          setSpeed(baseSpeed);
        }, GAME_SETTINGS.SLOWDOWN_DURATION);
        toast({ description: "Slowdown activated! Better control for a short time." });
        break;
    }
  }, [baseSpeed, toast]);

  // Optimized game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
    const deltaTime = timestamp - lastTimestampRef.current;
    
    // Update every ~16ms (60fps) for performance
    if (deltaTime > 16) {
      lastTimestampRef.current = timestamp;
      
      // Process player movement based on keys held
      if (keysPressed.current.ArrowLeft || keysPressed.current.a) {
        setPlayerPosition(prev => Math.max(0, prev - 1));
        keysPressed.current.ArrowLeft = false;
        keysPressed.current.a = false;
      }
      if (keysPressed.current.ArrowRight || keysPressed.current.d) {
        setPlayerPosition(prev => Math.min(GAME_SETTINGS.LANE_COUNT - 1, prev + 1));
        keysPressed.current.ArrowRight = false;
        keysPressed.current.d = false;
      }
      
      // Add obstacles with varying probability based on speed
      if (Math.random() > 0.95 - (speed * 0.01)) {
        const lane = Math.floor(Math.random() * GAME_SETTINGS.LANE_COUNT);
        const obstacleType = GAME_SETTINGS.OBSTACLE_TYPES[Math.floor(Math.random() * GAME_SETTINGS.OBSTACLE_TYPES.length)] as 'car' | 'barrier' | 'oil';
        
        // Don't place obstacles too close to each other in the same lane
        const existingObstaclesInLane = obstacles.filter(o => o.lane === lane && o.y < 15);
        
        if (existingObstaclesInLane.length === 0) {
          setObstacles(prev => [...prev, { 
            id: Date.now(), 
            lane, 
            y: 0,
            type: obstacleType,
            width: obstacleType === 'oil' ? 2 : 1 // Oil slicks are wider
          }]);
        }
      }
      
      // Add power-ups occasionally
      if (Math.random() > 0.995) {
        const lane = Math.floor(Math.random() * GAME_SETTINGS.LANE_COUNT);
        const powerUpType = GAME_SETTINGS.POWERUP_TYPES[Math.floor(Math.random() * GAME_SETTINGS.POWERUP_TYPES.length)] as 'boost' | 'shield' | 'slowdown';
        
        setPowerUps(prev => [...prev, { 
          id: Date.now(), 
          lane, 
          y: 0,
          type: powerUpType
        }]);
      }
      
      // Add coins in patterns
      if (Math.random() > 0.97) {
        const baseLane = Math.floor(Math.random() * GAME_SETTINGS.LANE_COUNT);
        
        // Create coin patterns (line, curve, zigzag)
        const pattern = Math.floor(Math.random() * 3);
        const newCoins: Coin[] = [];
        
        if (pattern === 0) {
          // Straight line
          for (let i = 0; i < 5; i++) {
            newCoins.push({
              id: Date.now() + i,
              lane: baseLane,
              y: -i * 5 // Spaced out vertically
            });
          }
        } else if (pattern === 1) {
          // Curve
          for (let i = 0; i < 5; i++) {
            const laneDelta = Math.min(i, GAME_SETTINGS.LANE_COUNT - 1 - baseLane);
            newCoins.push({
              id: Date.now() + i,
              lane: baseLane + laneDelta,
              y: -i * 5
            });
          }
        } else {
          // Zigzag
          for (let i = 0; i < 5; i++) {
            newCoins.push({
              id: Date.now() + i,
              lane: baseLane + (i % 2),
              y: -i * 5
            });
          }
        }
        
        setGameCoins(prev => [...prev, ...newCoins]);
      }
      
      // Move obstacles
      setObstacles(prev => {
        const newObstacles = prev
          .map(obstacle => ({ ...obstacle, y: obstacle.y + (speed / 10) }))
          .filter(obstacle => obstacle.y < 100);
          
        // Check collisions
        const playerY = 80; // Player's vertical position
        const collision = newObstacles.some(
          obstacle => {
            const hitbox = obstacle.width || 1;
            const isColliding = 
              obstacle.lane <= playerPosition + hitbox/2 && 
              obstacle.lane >= playerPosition - hitbox/2 && 
              obstacle.y > playerY - 5 && 
              obstacle.y < playerY + 5;
            
            if (isColliding) {
              // Create collision effect
              createParticles((obstacle.lane * 20) + 10, playerY, 30, '#ef4444');
              
              // Allow player to pass through if shielded or different behavior based on obstacle type
              if (playerEffects.shielded) {
                return false;
              }
              
              if (obstacle.type === 'oil') {
                // Oil slick causes slowdown rather than crash
                applyPowerUp('slowdown');
                return false;
              }
              
              return true;
            }
            return false;
          }
        );
        
        if (collision && !playerEffects.shielded) {
          handleGameOver();
        }
        
        return newObstacles;
      });
      
      // Move power-ups
      setPowerUps(prev => {
        const newPowerUps = prev
          .map(powerUp => ({ ...powerUp, y: powerUp.y + (speed / 10) }))
          .filter(powerUp => powerUp.y < 100);
          
        // Check collisions with power-ups
        const playerY = 80;
        newPowerUps.forEach((powerUp, index) => {
          if (
            powerUp.lane === playerPosition && 
            powerUp.y > playerY - 5 && 
            powerUp.y < playerY + 5
          ) {
            // Create collection effect
            createParticles((powerUp.lane * 20) + 10, playerY, 15, 
              powerUp.type === 'shield' ? '#3b82f6' : 
              powerUp.type === 'boost' ? '#f59e0b' : '#10b981'
            );
            
            // Apply power-up
            applyPowerUp(powerUp.type);
            
            // Remove collected power-up
            newPowerUps.splice(index, 1);
          }
        });
        
        return newPowerUps;
      });
      
      // Move coins
      setGameCoins(prev => {
        const newCoins = prev
          .map(coin => ({ ...coin, y: coin.y + (speed / 10) }))
          .filter(coin => coin.y < 100);
          
        // Check collisions with coins
        const playerY = 80;
        newCoins.forEach((coin, index) => {
          if (
            coin.lane === playerPosition && 
            coin.y > playerY - 5 && 
            coin.y < playerY + 5
          ) {
            // Create collection effect
            createParticles((coin.lane * 20) + 10, playerY, 10, '#fbbf24');
            
            // Add to score and coins
            setCoins(prev => prev + 1);
            setScore(prev => prev + GAME_SETTINGS.COIN_VALUE);
            
            // Remove collected coin
            newCoins.splice(index, 1);
          }
        });
        
        return newCoins;
      });
      
      // Update particles
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            size: p.life > 10 ? p.size : p.size * 0.9,
          }))
          .filter(p => p.life > 0)
      );
      
      // Increase score and distance based on speed
      setScore(prev => prev + Math.floor(speed / 5));
      setDistance(prev => prev + speed);
      
      // Increase speed gradually
      if (score > 0 && score % 500 === 0) {
        setBaseSpeed(prev => {
          const newSpeed = Math.min(prev + GAME_SETTINGS.SPEED_INCREMENT, GAME_SETTINGS.MAX_SPEED);
          setSpeed(newSpeed);
          return newSpeed;
        });
      }
    }
    
    // Continue the game loop
    if (!gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [applyPowerUp, createParticles, gameOver, obstacles, playerEffects.shielded, playerPosition, score, speed, baseSpeed]);

  // Handle game over
  const handleGameOver = useCallback(() => {
    setGameOver(true);
    
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Update progress
    const finalScore = score + (coins * GAME_SETTINGS.COIN_VALUE) + Math.floor(distance / 100);
    updateGameProgress('neon-racer-x', finalScore);
    
    toast({
      title: "Game Over!",
      description: `Your score: ${finalScore}. You earned 50 XP!`,
    });
  }, [coins, distance, score, toast]);

  // Start game with optimization
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCoins(0);
    setDistance(0);
    setObstacles([]);
    setPowerUps([]);
    setGameCoins([]);
    setParticles([]);
    setSpeed(GAME_SETTINGS.INITIAL_SPEED);
    setBaseSpeed(GAME_SETTINGS.INITIAL_SPEED);
    setPlayerPosition(2);
    setPlayerEffects({
      shielded: false,
      boosted: false,
      slowed: false
    });
    
    lastTimestampRef.current = 0;
    
    // Start the optimized game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      
      keysPressed.current[e.key] = true;
      
      // Prevent scrolling with arrow keys
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, gameStarted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

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
              <p className="text-white/90 mb-1">Distance: {Math.floor(distance)}m</p>
              <p className="text-white/90 mb-3">Coins: {coins}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Navigate your racer through neon-lit streets. Use left/right arrow keys or A/D to change lanes.
              Collect coins and power-ups to maximize your score!
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
          {/* Score, coin, and speed display */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Score: {score}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium flex items-center">
            <span className="text-yellow-400 mr-1">●</span>
            {coins}
          </div>
          <div className="absolute top-12 left-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Speed: {Math.floor(speed)}
          </div>
          <div className="absolute top-12 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Distance: {Math.floor(distance)}m
          </div>
          
          {/* Active power-ups */}
          <div className="absolute top-20 left-4 flex space-x-2">
            {playerEffects.shielded && (
              <div className="p-2 bg-blue-500/80 rounded-full" title="Shield Protection">
                <Shield size={16} className="text-white" />
              </div>
            )}
            {playerEffects.boosted && (
              <div className="p-2 bg-yellow-500/80 rounded-full" title="Speed Boost">
                <Zap size={16} className="text-white" />
              </div>
            )}
            {playerEffects.slowed && (
              <div className="p-2 bg-green-500/80 rounded-full" title="Slowdown">
                <Fuel size={16} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Game road with animated lanes */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: GAME_SETTINGS.LANE_COUNT }).map((_, lane) => (
              <div key={lane} className="flex-1 h-full border-x border-gray-700 relative overflow-hidden">
                {/* Lane markers - animated based on speed */}
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <div 
                      key={index}
                      className="absolute left-1/2 w-2 h-10 bg-yellow-400 transform -translate-x-1/2"
                      style={{ 
                        top: `${((index * 10) + (Date.now() / (100 / speed)) % 100) % 100}%`,
                        opacity: 0.7
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className={`absolute transform -translate-x-1/2 ${
                obstacle.type === 'car' ? 'bg-red-500 rounded-sm' : 
                obstacle.type === 'barrier' ? 'bg-gray-300 rounded' : 
                'bg-black rounded-full border-2 border-yellow-500'
              }`}
              style={{ 
                left: `${(obstacle.lane * 20) + 10}%`, 
                top: `${obstacle.y}%`,
                width: obstacle.type === 'car' ? '10px' : 
                  obstacle.type === 'barrier' ? '12px' : '20px',
                height: obstacle.type === 'car' ? '16px' : 
                  obstacle.type === 'barrier' ? '12px' : '8px',
              }}
            />
          ))}
          
          {/* Power-ups */}
          {powerUps.map(powerUp => (
            <div
              key={powerUp.id}
              className={`absolute w-8 h-8 rounded-full transform -translate-x-1/2 animate-pulse ${
                powerUp.type === 'shield' ? 'bg-blue-500' : 
                powerUp.type === 'boost' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ 
                left: `${(powerUp.lane * 20) + 10}%`, 
                top: `${powerUp.y}%`
              }}
            >
              {powerUp.type === 'shield' && <Shield size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
              {powerUp.type === 'boost' && <Zap size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
              {powerUp.type === 'slowdown' && <Fuel size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
            </div>
          ))}
          
          {/* Coins */}
          {gameCoins.map(coin => (
            <div
              key={coin.id}
              className="absolute w-6 h-6 rounded-full bg-yellow-400 transform -translate-x-1/2 animate-pulse"
              style={{ 
                left: `${(coin.lane * 20) + 10}%`, 
                top: `${coin.y}%`,
                boxShadow: '0 0 10px rgba(251, 191, 36, 0.7)'
              }}
            >
              <div className="absolute inset-2 bg-yellow-300 rounded-full" />
            </div>
          ))}
          
          {/* Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.life / particle.maxLife,
              }}
            />
          ))}
          
          {/* Player with shield effect if active */}
          <div className="relative">
            <div 
              className={`absolute w-10 h-16 ${
                playerEffects.shielded ? 'bg-blue-500' : 
                playerEffects.boosted ? 'bg-yellow-500' : 
                playerEffects.slowed ? 'bg-green-500' : 'bg-neon-blue'
              } rounded transform -translate-x-1/2`}
              style={{ 
                left: `${(playerPosition * 20) + 10}%`, 
                bottom: '15%',
                boxShadow: playerEffects.shielded ? '0 0 15px #3b82f6' : 
                  playerEffects.boosted ? '0 0 15px #f59e0b' : 
                  '0 0 10px rgba(59, 130, 246, 0.7)'
              }}
            />
            
            {/* Player trail effect */}
            {(playerEffects.boosted || !playerEffects.slowed) && (
              <div 
                className="absolute w-6 h-10 bg-neon-blue/30 rounded transform -translate-x-1/2 animate-pulse"
                style={{ 
                  left: `${(playerPosition * 20) + 10}%`, 
                  bottom: '10%'
                }}
              />
            )}
            
            {/* Shield visual effect */}
            {playerEffects.shielded && (
              <div 
                className="absolute w-14 h-20 border-2 border-blue-400 rounded transform -translate-x-1/2 animate-pulse"
                style={{ 
                  left: `${(playerPosition * 20) + 10}%`, 
                  bottom: '15%'
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NeonRacerX;
