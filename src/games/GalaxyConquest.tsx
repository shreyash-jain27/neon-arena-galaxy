
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';

const GalaxyConquest = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [resources, setResources] = useState(100);
  const [planets, setPlanets] = useState<{ id: number; x: number; y: number; size: number; owned: boolean; }[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);
  const { toast } = useToast();
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setResources(100);
    
    // Generate planets
    const newPlanets = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 15 + 5,
      owned: i === 0 // Player starts with one planet
    }));
    
    setPlanets(newPlanets);
    
    // Game loop for resource generation and AI moves
    const gameInterval = setInterval(() => {
      // Generate resources from owned planets
      const ownedPlanetCount = planets.filter(p => p.owned).length;
      setResources(prev => prev + ownedPlanetCount * 2);
      
      // AI opponent makes moves
      if (Math.random() > 0.8) {
        setPlanets(prev => {
          const unownedPlanets = prev.filter(p => !p.owned);
          if (unownedPlanets.length === 0) {
            clearInterval(gameInterval);
            setGameOver(true);
            
            // Player wins
            const finalScore = score + resources + planets.filter(p => p.owned).length * 1000;
            setScore(finalScore);
            
            // Update progress
            const progress = updateGameProgress('galaxy-conquest', finalScore);
            
            toast({
              title: "Victory!",
              description: `You've conquered the galaxy! Score: ${finalScore}. You earned 50 XP!`,
            });
            
            return prev;
          }
          
          // AI captures a random planet
          const randomIndex = Math.floor(Math.random() * unownedPlanets.length);
          const targetPlanet = unownedPlanets[randomIndex];
          
          // Check if player lost all planets
          const playerPlanets = prev.filter(p => p.owned);
          if (playerPlanets.length === 0) {
            clearInterval(gameInterval);
            setGameOver(true);
            
            // Update progress
            const progress = updateGameProgress('galaxy-conquest', score);
            
            toast({
              title: "Defeat!",
              description: `The enemy has conquered your empire! Score: ${score}. You earned 50 XP!`,
            });
          }
          
          return prev.map(p => 
            p.id === targetPlanet.id 
              ? { ...p, owned: false, enemy: true } 
              : p
          );
        });
      }
      
      // Increase score over time
      setScore(prev => prev + 1);
      
    }, 1000);
    
    return () => clearInterval(gameInterval);
  };
  
  const handlePlanetClick = (planetId: number) => {
    if (!gameStarted || gameOver) return;
    
    const clickedPlanet = planets.find(p => p.id === planetId);
    
    if (clickedPlanet) {
      if (clickedPlanet.owned) {
        // Select owned planet
        setSelectedPlanet(planetId);
      } else if (selectedPlanet !== null) {
        // Try to conquer this planet from a selected planet
        const sourcePlanet = planets.find(p => p.id === selectedPlanet);
        
        if (sourcePlanet) {
          // Calculate distance
          const distance = Math.sqrt(
            Math.pow(sourcePlanet.x - clickedPlanet.x, 2) + 
            Math.pow(sourcePlanet.y - clickedPlanet.y, 2)
          );
          
          // Cost based on distance and planet size
          const cost = Math.floor(distance * 2 + clickedPlanet.size * 5);
          
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
            setScore(prev => prev + 100);
            setSelectedPlanet(null);
            
            toast({
              description: `Planet conquered! +100 points`,
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
  };
  
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
              Resources: {resources}
            </div>
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Score: {score}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4 text-center text-white/70 text-sm">
            {selectedPlanet !== null 
              ? "Now click on a planet to conquer it"
              : "Click on one of your planets (green) to select it"}
          </div>
          
          {/* Game Universe */}
          <div className="w-full h-[calc(100%-6rem)] relative bg-black rounded-lg overflow-hidden">
            {/* Stars */}
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
              />
            ))}
            
            {/* Planets */}
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
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handlePlanetClick(planet.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalaxyConquest;
