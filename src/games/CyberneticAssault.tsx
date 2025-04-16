import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';
import { Zap, Shield, Heart } from 'lucide-react';

// Game settings for easier tuning
const GAME_SETTINGS = {
  ENEMY_SPAWN_RATE: 0.7,
  ENEMY_SPEED_BASE: 1,
  ENEMY_SPEED_INCREMENT: 0.0005,
  POWER_UP_CHANCE: 0.005,
  BULLET_SPEED: 3,
  PLAYER_SPEED: 5,
  SHIELD_DURATION: 5000,
};

// Game entities
interface Enemy {
  id: number;
  x: number;
  y: number;
  size: number;
  health: number;
  speed: number;
  type: 'normal' | 'fast' | 'tank';
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: 'shield' | 'health' | 'rapidFire';
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

const CyberneticAssault = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [isShielded, setIsShielded] = useState(false);
  const [isRapidFire, setIsRapidFire] = useState(false);
  const [level, setLevel] = useState(1);
  
  // Game loop optimizations
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const enemySpeedRef = useRef(GAME_SETTINGS.ENEMY_SPEED_BASE);
  const keysPressed = useRef<{[key: string]: boolean}>({});
  const lastShotTime = useRef<number>(0);
  const { toast } = useToast();

  // Create particles for visual effects
  const createParticles = useCallback((x: number, y: number, count: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 1,
        color,
        life: Math.random() * 30 + 20,
        maxLife: 50,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Optimized game loop using requestAnimationFrame
  const gameLoop = useCallback((time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - (previousTimeRef.current || 0);
    previousTimeRef.current = time;
    
    // Move bullets
    setBullets(prev => 
      prev.map(bullet => ({
        ...bullet,
        y: bullet.y - GAME_SETTINGS.BULLET_SPEED,
        x: bullet.x + bullet.vx,
      })).filter(bullet => bullet.y > 0)
    );
    
    // Process player movement from keys pressed
    if (gameStarted && !gameOver) {
      if (keysPressed.current.ArrowLeft || keysPressed.current.a) {
        setPlayerPosition(prev => ({ ...prev, x: Math.max(5, prev.x - GAME_SETTINGS.PLAYER_SPEED) }));
      }
      if (keysPressed.current.ArrowRight || keysPressed.current.d) {
        setPlayerPosition(prev => ({ ...prev, x: Math.min(95, prev.x + GAME_SETTINGS.PLAYER_SPEED) }));
      }
      if (keysPressed.current.ArrowUp || keysPressed.current.w) {
        setPlayerPosition(prev => ({ ...prev, y: Math.max(5, prev.y - GAME_SETTINGS.PLAYER_SPEED) }));
      }
      if (keysPressed.current.ArrowDown || keysPressed.current.s) {
        setPlayerPosition(prev => ({ ...prev, y: Math.min(85, prev.y + GAME_SETTINGS.PLAYER_SPEED) }));
      }
      
      // Auto-fire if space is pressed or rapid fire is active
      if ((keysPressed.current[' '] || isRapidFire) && time - lastShotTime.current > (isRapidFire ? 100 : 300)) {
        setBullets(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            x: playerPosition.x, 
            y: playerPosition.y - 5,
            vx: 0,
            vy: -GAME_SETTINGS.BULLET_SPEED
          }
        ]);
        lastShotTime.current = time;
        
        // Create shooting effect
        createParticles(playerPosition.x, playerPosition.y - 5, 3, '#60a5fa');
      }
    }
    
    // Move enemies and check for collisions
    setEnemies(prev => {
      // Increase enemy speed gradually over time
      enemySpeedRef.current += GAME_SETTINGS.ENEMY_SPEED_INCREMENT;
      
      return prev.map(enemy => ({
        ...enemy,
        y: enemy.y + (enemy.speed * enemySpeedRef.current)
      })).filter(enemy => {
        // Remove enemies that go off screen
        if (enemy.y > 95) {
          return false;
        }
        return true;
      });
    });
    
    // Move power-ups down
    setPowerUps(prev => 
      prev.map(powerUp => ({
        ...powerUp,
        y: powerUp.y + 0.5
      })).filter(powerUp => powerUp.y < 95)
    );
    
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
    
    // Spawn new enemies based on level
    if (gameStarted && !gameOver && Math.random() > GAME_SETTINGS.ENEMY_SPAWN_RATE - (level * 0.05)) {
      const enemyType = Math.random();
      let newEnemy: Enemy;
      
      if (enemyType > 0.8) {
        // Fast enemy - smaller but quicker
        newEnemy = {
          id: Date.now(),
          x: Math.floor(Math.random() * 90),
          y: 0,
          size: 2,
          health: 1,
          speed: 1.5,
          type: 'fast'
        };
      } else if (enemyType > 0.6) {
        // Tank enemy - larger but with more health
        newEnemy = {
          id: Date.now(),
          x: Math.floor(Math.random() * 90),
          y: 0,
          size: 6,
          health: 3,
          speed: 0.7,
          type: 'tank'
        };
      } else {
        // Normal enemy
        newEnemy = {
          id: Date.now(),
          x: Math.floor(Math.random() * 90),
          y: 0,
          size: 4,
          health: 1,
          speed: 1,
          type: 'normal'
        };
      }
      
      setEnemies(prev => [...prev, newEnemy]);
    }
    
    // Spawn power-ups randomly
    if (gameStarted && !gameOver && Math.random() < GAME_SETTINGS.POWER_UP_CHANCE) {
      const powerUpType = ['shield', 'health', 'rapidFire'][Math.floor(Math.random() * 3)] as 'shield' | 'health' | 'rapidFire';
      
      setPowerUps(prev => [
        ...prev,
        {
          id: Date.now(),
          x: Math.floor(Math.random() * 90) + 5,
          y: 0,
          type: powerUpType
        }
      ]);
    }
    
    // Check for bullet hits on enemies
    setBullets(prevBullets => {
      let newBullets = [...prevBullets];
      
      setEnemies(prevEnemies => {
        let newEnemies = [...prevEnemies];
        let hitDetected = false;
        
        // Check each bullet against each enemy
        newBullets = newBullets.filter(bullet => {
          let bulletHit = false;
          
          newEnemies = newEnemies.map(enemy => {
            // Check for collision between bullet and enemy
            if (
              Math.abs(bullet.x - enemy.x) < enemy.size + 2 && 
              Math.abs(bullet.y - enemy.y) < enemy.size + 2
            ) {
              // Bullet hit enemy
              bulletHit = true;
              hitDetected = true;
              
              // Create impact effect
              createParticles(enemy.x, enemy.y, 10, '#ef4444');
              
              // Reduce enemy health
              return {
                ...enemy,
                health: enemy.health - 1
              };
            }
            return enemy;
          }).filter(enemy => {
            // Remove destroyed enemies
            if (enemy.health <= 0) {
              // Add score based on enemy type
              const scoreValue = enemy.type === 'tank' ? 30 : 
                enemy.type === 'fast' ? 20 : 10;
                
              setScore(prev => prev + scoreValue);
              
              // Create explosion effect
              createParticles(enemy.x, enemy.y, 20, '#fbbf24');
              
              // Level up every 500 points
              if ((score + scoreValue) % 500 < score % 500) {
                setLevel(prev => prev + 1);
                toast({
                  description: `Level Up! Now at level ${level + 1}`,
                });
              }
              
              return false;
            }
            return true;
          });
          
          // Keep bullet if it hasn't hit anything
          return !bulletHit;
        });
        
        return newEnemies;
      });
      
      return newBullets;
    });
    
    // Check for player collisions with enemies
    if (!gameOver) {
      setEnemies(prevEnemies => {
        let collision = false;
        
        const filteredEnemies = prevEnemies.filter(enemy => {
          // Check for collision between player and enemy
          if (
            Math.abs(enemy.x - playerPosition.x) < (enemy.size + 5) && 
            Math.abs(enemy.y - playerPosition.y) < (enemy.size + 5)
          ) {
            // Create impact effect
            createParticles(playerPosition.x, playerPosition.y, 15, '#ef4444');
            
            // If player has shield, destroy enemy but don't take damage
            if (isShielded) {
              createParticles(playerPosition.x, playerPosition.y, 20, '#3b82f6');
              return false;
            }
            
            // Player takes damage based on enemy type
            const damage = enemy.type === 'tank' ? 30 : 
              enemy.type === 'fast' ? 10 : 20;
            
            setPlayerHealth(prev => {
              const newHealth = Math.max(0, prev - damage);
              
              // Check for game over
              if (newHealth <= 0) {
                collision = true;
              }
              
              return newHealth;
            });
            
            return false;
          }
          return true;
        });
        
        if (collision) {
          handleGameOver();
        }
        
        return filteredEnemies;
      });
      
      // Check for player collision with power-ups
      setPowerUps(prevPowerUps => {
        return prevPowerUps.filter(powerUp => {
          // Check for collision between player and power-up
          if (
            Math.abs(powerUp.x - playerPosition.x) < 8 && 
            Math.abs(powerUp.y - playerPosition.y) < 8
          ) {
            // Apply power-up effect
            if (powerUp.type === 'shield') {
              setIsShielded(true);
              // Shield lasts for a limited time
              setTimeout(() => setIsShielded(false), GAME_SETTINGS.SHIELD_DURATION);
              createParticles(playerPosition.x, playerPosition.y, 30, '#3b82f6');
              toast({
                description: "Shield activated! Temporary invulnerability.",
              });
            } else if (powerUp.type === 'health') {
              setPlayerHealth(prev => Math.min(100, prev + 25));
              createParticles(playerPosition.x, playerPosition.y, 20, '#10b981');
              toast({
                description: "Health restored! +25 HP",
              });
            } else if (powerUp.type === 'rapidFire') {
              setIsRapidFire(true);
              // Rapid fire lasts for a limited time
              setTimeout(() => setIsRapidFire(false), 5000);
              createParticles(playerPosition.x, playerPosition.y, 20, '#f59e0b');
              toast({
                description: "Rapid fire activated! Increased fire rate.",
              });
            }
            
            return false;
          }
          return true;
        });
      });
    }
    
    // Continue the game loop
    if (gameStarted && !gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [createParticles, gameOver, gameStarted, isRapidFire, isShielded, level, playerPosition, score, toast]);
  
  // Game over handler
  const handleGameOver = useCallback(() => {
    setGameOver(true);
    
    // Create explosion effect at player position
    createParticles(playerPosition.x, playerPosition.y, 50, '#ef4444');
    
    // Clean up game loop
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    // Update progress
    updateGameProgress('cybernetic-assault', score);
    
    toast({
      title: "Game Over!",
      description: `Your score: ${score}. You earned 50 XP!`,
    });
  }, [createParticles, playerPosition.x, playerPosition.y, score, toast]);
  
  // Start game function
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setEnemies([]);
    setBullets([]);
    setPowerUps([]);
    setParticles([]);
    setPlayerHealth(100);
    setIsShielded(false);
    setIsRapidFire(false);
    setLevel(1);
    setPlayerPosition({ x: 50, y: 75 });
    
    enemySpeedRef.current = GAME_SETTINGS.ENEMY_SPEED_BASE;
    previousTimeRef.current = undefined;
    keysPressed.current = {};
    
    // Start the game loop
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);
  
  // Handle keyboard events for smoother movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      
      // Prevent page scrolling with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
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
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
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
              Navigate through enemy cyborgs in this fast-paced action game. Use arrow keys or WASD to move,
              SPACE to shoot. Collect power-ups to gain advantages.
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
        <div className="w-full h-full relative bg-gaming-darker">
          {/* HUD - Health, Score, Level */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium flex items-center">
            <Heart size={16} className="text-red-500 fill-red-500 mr-1" />
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden ml-1">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${playerHealth}%`,
                  backgroundColor: playerHealth > 60 ? '#10b981' : playerHealth > 30 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
          </div>
          
          <div className="absolute top-4 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Score: {score}
          </div>
          
          <div className="absolute top-12 right-4 px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
            Level: {level}
          </div>
          
          {/* Active power-ups */}
          <div className="absolute top-12 left-4 flex space-x-2">
            {isShielded && (
              <div className="p-2 bg-blue-500/80 rounded-full" title="Shield Protection">
                <Shield size={16} className="text-white" />
              </div>
            )}
            {isRapidFire && (
              <div className="p-2 bg-yellow-500/80 rounded-full" title="Rapid Fire">
                <Zap size={16} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Player */}
          <div 
            className={`absolute w-10 h-10 rounded-full ${isShielded ? 'bg-neon-blue' : 'bg-neon-purple'}`}
            style={{ 
              left: `${playerPosition.x}%`, 
              top: `${playerPosition.y}%`, 
              transform: 'translate(-50%, -50%)',
              boxShadow: isShielded ? '0 0 15px #3b82f6' : '0 0 10px rgba(139, 92, 246, 0.7)'
            }}
          />
          
          {/* Shield effect */}
          {isShielded && (
            <div 
              className="absolute rounded-full border-2 border-blue-400 animate-pulse pointer-events-none"
              style={{ 
                left: `${playerPosition.x}%`, 
                top: `${playerPosition.y}%`, 
                width: '20px', 
                height: '20px',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
          
          {/* Bullets */}
          {bullets.map(bullet => (
            <div
              key={bullet.id}
              className="absolute w-2 h-4 bg-neon-blue rounded-full"
              style={{ 
                left: `${bullet.x}%`, 
                top: `${bullet.y}%`, 
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Enemies */}
          {enemies.map(enemy => (
            <div
              key={enemy.id}
              className={`absolute rounded-full ${
                enemy.type === 'fast' ? 'bg-yellow-500' : 
                enemy.type === 'tank' ? 'bg-gray-700' : 'bg-red-500'
              }`}
              style={{ 
                left: `${enemy.x}%`, 
                top: `${enemy.y}%`, 
                width: `${enemy.size * 2}px`, 
                height: `${enemy.size * 2}px`, 
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
          
          {/* Power-ups */}
          {powerUps.map(powerUp => (
            <div
              key={powerUp.id}
              className={`absolute w-6 h-6 rounded-md ${
                powerUp.type === 'shield' ? 'bg-blue-500' : 
                powerUp.type === 'health' ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`}
              style={{ 
                left: `${powerUp.x}%`, 
                top: `${powerUp.y}%`, 
                transform: 'translate(-50%, -50%)'
              }}
            >
              {powerUp.type === 'shield' && <Shield size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
              {powerUp.type === 'health' && <Heart size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
              {powerUp.type === 'rapidFire' && <Zap size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />}
            </div>
          ))}
          
          {/* Particles for effects */}
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
