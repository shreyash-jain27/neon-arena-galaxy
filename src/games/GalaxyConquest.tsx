
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';
import { Shield, Star, Rocket, Zap } from 'lucide-react';

// Game settings for easier tuning
const GAME_SETTINGS = {
  INITIAL_RESOURCES: 100,
  PLANET_COUNT: 15,
  RESOURCE_GENERATION_RATE: 2,
  AI_MOVE_CHANCE: 0.8,
  CONQUEST_BASE_COST: 5,
  CONQUEST_DISTANCE_FACTOR: 2,
  CONQUEST_SCORE: 100,
};

// Particle effect for visual feedback
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

const GalaxyConquest = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [resources, setResources] = useState(GAME_SETTINGS.INITIAL_RESOURCES);
  const [planets, setPlanets] = useState<{ 
    id: number; 
    x: number; 
    y: number; 
    size: number; 
    owned: boolean; 
    enemy?: boolean;
    resourceRate?: number;
    defenseBonus?: number;
  }[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [powerUps, setPowerUps] = useState<{
    doubleResources: boolean;
    shield: boolean;
    fastTravel: boolean;
  }>({
    doubleResources: false,
    shield: false,
    fastTravel: false,
  });
  
  // For game optimization
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
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
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color,
        life: Math.random() * 30 + 20,
        maxLife: 50,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);
  
  // Update particles (animation)
  const updateParticles = useCallback(() => {
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
  }, []);
  
  // Activate a power-up
  const activatePowerUp = useCallback((type: 'doubleResources' | 'shield' | 'fastTravel') => {
    setPowerUps(prev => ({ ...prev, [type]: true }));
    
    // Power-up wears off after a time
    setTimeout(() => {
      setPowerUps(prev => ({ ...prev, [type]: false }));
      toast({
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} power-up has expired!`,
      });
    }, 15000); // 15 seconds
    
    toast({
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} power-up activated!`,
    });
  }, [toast]);
  
  // Game loop with optimization
  const gameLoop = useCallback((timestamp: number) => {
    // Limit updates to ~60fps
    if (timestamp - lastUpdateTimeRef.current < 16) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    lastUpdateTimeRef.current = timestamp;
    
    // Update particles for visual effects
    updateParticles();
    
    // Randomly spawn power-ups
    if (Math.random() > 0.997) {
      const randomPowerUp = ['doubleResources', 'shield', 'fastTravel'][Math.floor(Math.random() * 3)] as 'doubleResources' | 'shield' | 'fastTravel';
      activatePowerUp(randomPowerUp);
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateParticles, activatePowerUp]);
  
  // Start game with optimized setup
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setResources(GAME_SETTINGS.INITIAL_RESOURCES);
    setParticles([]);
    setPowerUps({
      doubleResources: false,
      shield: false,
      fastTravel: false,
    });
    
    // Generate planets with varied properties
    const newPlanets = Array.from({ length: GAME_SETTINGS.PLANET_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 15 + 5,
      owned: i === 0, // Player starts with one planet
      resourceRate: Math.random() * 2 + 1, // Random resource generation rate
      defenseBonus: Math.random() * 0.3, // Random defense bonus
    }));
    
    setPlanets(newPlanets);
    
    // Start optimized game loop
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    lastUpdateTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    // Resource generation and AI moves interval
    const gameInterval = setInterval(() => {
      // Generate resources from owned planets with bonuses
      const ownedPlanets = planets.filter(p => p.owned);
      const resourceMultiplier = powerUps.doubleResources ? 2 : 1;
      
      setResources(prev => {
        let newResources = prev;
        
        // Each planet contributes based on its resourceRate
        ownedPlanets.forEach(planet => {
          const rate = planet.resourceRate || GAME_SETTINGS.RESOURCE_GENERATION_RATE;
          newResources += rate * resourceMultiplier;
        });
        
        return newResources;
      });
      
      // AI opponent makes smarter moves
      if (Math.random() > GAME_SETTINGS.AI_MOVE_CHANCE) {
        setPlanets(prev => {
          const unownedPlanets = prev.filter(p => !p.owned && !p.enemy);
          const enemyPlanets = prev.filter(p => p.enemy);
          
          // Check for victory condition
          if (unownedPlanets.length === 0 && enemyPlanets.length === 0) {
            clearInterval(gameInterval);
            setGameOver(true);
            
            // Player wins
            const finalScore = score + resources + planets.filter(p => p.owned).length * 1000;
            setScore(finalScore);
            
            // Update progress
            updateGameProgress('galaxy-conquest', finalScore);
            
            toast({
              title: "Victory!",
              description: `You've conquered the galaxy! Score: ${finalScore}. You earned 50 XP!`,
            });
            
            return prev;
          }
          
          // AI strategy:
          // 1. If there are unowned planets, capture a strategic one (closest or largest)
          // 2. If no unowned planets, attack player planets
          
          if (unownedPlanets.length > 0) {
            // Target either the largest planet or one close to player planets
            unownedPlanets.sort((a, b) => b.size - a.size);
            const targetPlanet = unownedPlanets[0];
            
            return prev.map(p => 
              p.id === targetPlanet.id 
                ? { ...p, owned: false, enemy: true } 
                : p
            );
          } else if (enemyPlanets.length > 0) {
            // Check if player lost all planets
            const playerPlanets = prev.filter(p => p.owned);
            if (playerPlanets.length === 0) {
              clearInterval(gameInterval);
              setGameOver(true);
              
              // Update progress
              updateGameProgress('galaxy-conquest', score);
              
              toast({
                title: "Defeat!",
                description: `The enemy has conquered your empire! Score: ${score}. You earned 50 XP!`,
              });
              
              return prev;
            }
            
            // AI attacks a player planet
            const playerPlanet = playerPlanets[Math.floor(Math.random() * playerPlanets.length)];
            
            // If player has shield powerup, prevent attack
            if (powerUps.shield) {
              createParticles(playerPlanet.x, playerPlanet.y, 20, '#4f46e5');
              return prev;
            }
            
            return prev.map(p => 
              p.id === playerPlanet.id 
                ? { ...p, owned: false, enemy: true } 
                : p
            );
          }
          
          return prev;
        });
      }
      
      // Increase score over time
      setScore(prev => prev + 1);
      
    }, 1000);
    
    return () => {
      clearInterval(gameInterval);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [createParticles, gameLoop, planets, powerUps, score, toast]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);
  
  // Handle planet selection and conquest with improved mechanics
  const handlePlanetClick = useCallback((planetId: number) => {
    if (!gameStarted || gameOver) return;
    
    const clickedPlanet = planets.find(p => p.id === planetId);
    
    if (clickedPlanet) {
      if (clickedPlanet.owned) {
        // Select owned planet
        setSelectedPlanet(planetId);
        createParticles(clickedPlanet.x, clickedPlanet.y, 15, '#10b981');
      } else if (selectedPlanet !== null) {
        // Try to conquer this planet from a selected planet
        const sourcePlanet = planets.find(p => p.id === selectedPlanet);
        
        if (sourcePlanet) {
          // Calculate distance
          const distance = Math.sqrt(
            Math.pow(sourcePlanet.x - clickedPlanet.x, 2) + 
            Math.pow(sourcePlanet.y - clickedPlanet.y, 2)
          );
          
          // Apply fast travel discount if powerup is active
          const distanceFactor = powerUps.fastTravel ? 
            GAME_SETTINGS.CONQUEST_DISTANCE_FACTOR / 2 : 
            GAME_SETTINGS.CONQUEST_DISTANCE_FACTOR;
          
          // Cost based on distance, planet size, and defense bonus
          const sizeCost = clickedPlanet.size * GAME_SETTINGS.CONQUEST_BASE_COST;
          const distanceCost = distance * distanceFactor;
          const defenseCost = clickedPlanet.enemy ? 
            (clickedPlanet.defenseBonus || 0) * 100 : 0;
          
          const cost = Math.floor(distanceCost + sizeCost + defenseCost);
          
          if (resources >= cost) {
            // Conquer the planet
            setResources(prev => prev - cost);
            setPlanets(prev => 
              prev.map(p => 
                p.id === clickedPlanet.id 
                  ? { ...p, owned: true, enemy: false } 
                  : p
              )
            );
            
            // Create conquest effect
            createParticles(clickedPlanet.x, clickedPlanet.y, 30, '#10b981');
            
            // Bonus score for taking from enemy
            const conquestScore = clickedPlanet.enemy ? 
              GAME_SETTINGS.CONQUEST_SCORE * 2 : 
              GAME_SETTINGS.CONQUEST_SCORE;
            
            setScore(prev => prev + conquestScore);
            setSelectedPlanet(null);
            
            toast({
              description: `Planet conquered! +${conquestScore} points`,
            });
          } else {
            toast({
              variant: "destructive",
              description: `Not enough resources! Need ${cost} resources.`,
            });
          }
        }
      }
    }
  }, [createParticles, gameOver, gameStarted, planets, powerUps.fastTravel, resources, selectedPlanet, toast]);
  
  return (
    <div className="w-full h-full relative bg-black rounded-lg overflow-hidden">
      {!gameStarted || gameOver ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4 text-neon-green">
            {gameOver ? (planets.some(p => p.owned) ? 'Victory!' : 'Defeat!') : 'Galaxy Conquest'}
          </h2>
          
          {gameOver && (
            <div className="mb-6 text-center">
              <p className="text-white text-lg mb-2">Your score: {score}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Build your galactic empire by conquering planets. Select your planet, then click on an unclaimed planet to conquer it.
              Watch for special power-ups to gain advantages!
            </p>
          )}
          
          <button 
            onClick={startGame}
            className="px-6 py-3 bg-neon-green rounded-full text-black font-medium hover:bg-neon-green/80 transition-colors"
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative p-4">
          {/* Resource and score display */}
          <div className="flex justify-between mb-4">
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Resources: {Math.floor(resources)}
            </div>
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Score: {score}
            </div>
          </div>
          
          {/* Active power-ups */}
          <div className="absolute top-14 left-4 flex space-x-2">
            {powerUps.doubleResources && (
              <div className="p-2 bg-yellow-500/80 rounded-full" title="Double Resources">
                <Zap size={16} className="text-white" />
              </div>
            )}
            {powerUps.shield && (
              <div className="p-2 bg-blue-500/80 rounded-full" title="Shield Protection">
                <Shield size={16} className="text-white" />
              </div>
            )}
            {powerUps.fastTravel && (
              <div className="p-2 bg-purple-500/80 rounded-full" title="Fast Travel">
                <Rocket size={16} className="text-white" />
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 text-center text-white/70 text-sm">
            {selectedPlanet !== null 
              ? "Now click on a planet to conquer it"
              : "Click on one of your planets (green) to select it"}
          </div>
          
          {/* Game Universe */}
          <div className="w-full h-[calc(100%-6rem)] relative bg-black rounded-lg overflow-hidden">
            {/* Stars - more variation in size and brightness */}
            {Array.from({ length: 200 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 0.5}px`,
                  height: `${Math.random() * 2 + 0.5}px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  backgroundColor: Math.random() > 0.8 ? '#f0f0ff' : '#ffffff',
                  animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`
                }}
              />
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
            
            {/* Planets with enhanced visuals */}
            {planets.map(planet => (
              <div
                key={planet.id}
                className={`absolute rounded-full cursor-pointer ${
                  planet.owned 
                    ? planet.id === selectedPlanet
                      ? 'bg-neon-blue shadow-neon' 
                      : 'bg-neon-green'
                    : planet.enemy 
                      ? 'bg-red-500' 
                      : 'bg-gray-400'
                }`}
                style={{ 
                  left: `${planet.x}%`, 
                  top: `${planet.y}%`, 
                  width: `${planet.size}px`, 
                  height: `${planet.size}px`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: planet.owned || planet.enemy 
                    ? `0 0 ${planet.size/2}px ${planet.owned ? '#10b981' : '#ef4444'}` 
                    : 'none'
                }}
                onClick={() => handlePlanetClick(planet.id)}
              >
                {/* Planet resource indicator */}
                {planet.owned && (
                  <div 
                    className="absolute -top-1 -right-1 bg-yellow-500 rounded-full flex items-center justify-center"
                    style={{
                      width: `${Math.max(planet.size/3, 6)}px`,
                      height: `${Math.max(planet.size/3, 6)}px`,
                    }}
                  >
                    <Star 
                      size={Math.max(planet.size/5, 4)} 
                      className="text-yellow-200 fill-yellow-200" 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyConquest;
