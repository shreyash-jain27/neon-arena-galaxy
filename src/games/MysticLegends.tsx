
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';

const MysticLegends = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [health, setHealth] = useState(100);
  const [inventory, setInventory] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState('village');
  const [message, setMessage] = useState('Welcome to Mystic Legends!');
  const { toast } = useToast();

  const locations = {
    village: {
      name: 'Village of Mistwood',
      description: 'A peaceful village at the edge of a mysterious forest.',
      options: ['forest', 'mountain', 'tavern']
    },
    forest: {
      name: 'Enchanted Forest',
      description: 'A dense forest filled with magical creatures and hidden treasures.',
      options: ['village', 'cave', 'river']
    },
    mountain: {
      name: 'Dragonspire Mountain',
      description: 'A treacherous mountain where dragons are said to reside.',
      options: ['village', 'peak', 'cave']
    },
    tavern: {
      name: 'Golden Goblet Tavern',
      description: 'A lively tavern where adventurers share tales of their journeys.',
      options: ['village', 'quest']
    },
    cave: {
      name: 'Crystal Cave',
      description: 'A dark cave filled with glowing crystals and dangerous monsters.',
      options: ['forest', 'mountain']
    },
    river: {
      name: 'Silvermoon River',
      description: 'A magical river said to grant wishes to those pure of heart.',
      options: ['forest', 'lake']
    },
    peak: {
      name: 'Dragon\'s Peak',
      description: 'The summit of Dragonspire Mountain, home to the ancient dragon.',
      options: ['mountain']
    },
    lake: {
      name: 'Mirror Lake',
      description: 'A mystical lake where the water reflects not just your appearance, but your true self.',
      options: ['river']
    },
    quest: {
      name: 'Quest Board',
      description: 'A board with various quests posted by villagers and travelers.',
      options: ['tavern', 'accept']
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setHealth(100);
    setInventory(['Wooden Sword', 'Health Potion']);
    setCurrentLocation('village');
    setMessage('You begin your adventure in the Village of Mistwood.');
  };

  const handleLocationChange = (location: string) => {
    if (location === 'accept') {
      // Accept a quest
      setMessage('You accepted a quest to retrieve a magical artifact from the Crystal Cave!');
      setScore(prev => prev + 50);
      return;
    }
    
    setCurrentLocation(location);
    setMessage(`You travel to the ${locations[location as keyof typeof locations].name}.`);
    
    // Random events
    const randomEvent = Math.random();
    
    if (randomEvent > 0.8) {
      // Find treasure
      const items = ['Magic Scroll', 'Golden Key', 'Silver Dagger', 'Healing Herbs', 'Mysterious Amulet'];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      if (!inventory.includes(randomItem)) {
        setInventory(prev => [...prev, randomItem]);
        setMessage(prev => `${prev} You found a ${randomItem}!`);
        setScore(prev => prev + 100);
      }
    } else if (randomEvent > 0.6 && location !== 'village' && location !== 'tavern') {
      // Combat encounter
      const damage = Math.floor(Math.random() * 20) + 5;
      setHealth(prev => Math.max(0, prev - damage));
      setMessage(prev => `${prev} You encountered a monster and took ${damage} damage!`);
      
      if (health - damage <= 0) {
        setGameOver(true);
        
        // Update progress
        const progress = updateGameProgress('mystic-legends', score);
        
        toast({
          title: "Game Over!",
          description: `Your health reached zero. Final score: ${score}. You earned 50 XP!`,
        });
      } else {
        // Successful combat
        setScore(prev => prev + 25);
      }
    }
    
    // Increase score for exploration
    setScore(prev => prev + 10);
  };

  const useHealthPotion = () => {
    if (inventory.includes('Health Potion')) {
      setInventory(prev => prev.filter(item => item !== 'Health Potion'));
      setHealth(prev => Math.min(100, prev + 30));
      setMessage('You used a Health Potion and restored 30 health!');
    }
  };

  return (
    <div className="w-full h-full relative bg-gaming-darker rounded-lg overflow-hidden">
      {!gameStarted || gameOver ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            {gameOver ? 'Your Adventure Ends' : 'Mystic Legends'}
          </h2>
          
          {gameOver && (
            <div className="mb-6 text-center">
              <p className="text-white text-lg mb-2">Your score: {score}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Embark on an epic journey through a magical realm. Explore locations, find treasures, and complete quests.
            </p>
          )}
          
          <button 
            onClick={startGame}
            className="px-6 py-3 bg-purple-600 rounded-full text-white font-medium hover:bg-purple-700 transition-colors"
          >
            {gameOver ? 'New Adventure' : 'Begin Adventure'}
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col p-4">
          {/* Status bar */}
          <div className="flex justify-between mb-4">
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Health: {health}/100
            </div>
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Score: {score}
            </div>
          </div>
          
          {/* Game content */}
          <div className="flex-grow flex flex-col md:flex-row gap-4">
            {/* Location info */}
            <div className="md:w-2/3 bg-gaming-dark/50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                {locations[currentLocation as keyof typeof locations].name}
              </h3>
              <p className="text-white/80 mb-4">
                {locations[currentLocation as keyof typeof locations].description}
              </p>
              
              <div className="bg-black/30 p-3 rounded mb-4 min-h-[100px] text-white/90">
                {message}
              </div>
              
              <h4 className="text-white font-medium mb-2">Where will you go?</h4>
              <div className="flex flex-wrap gap-2">
                {locations[currentLocation as keyof typeof locations].options.map(location => (
                  <button
                    key={location}
                    onClick={() => handleLocationChange(location)}
                    className="px-3 py-1 bg-purple-600/70 hover:bg-purple-600 rounded text-white text-sm"
                  >
                    {location === 'accept' ? 'Accept Quest' : locations[location as keyof typeof locations].name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Inventory */}
            <div className="md:w-1/3 bg-gaming-dark/50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-purple-400 mb-3">Inventory</h3>
              
              {inventory.length > 0 ? (
                <ul className="space-y-2">
                  {inventory.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-black/20 rounded">
                      <span className="text-white">{item}</span>
                      {item === 'Health Potion' && (
                        <button
                          onClick={useHealthPotion}
                          className="px-2 py-1 bg-green-600/70 hover:bg-green-600 rounded text-xs text-white"
                        >
                          Use
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50 text-center">Your inventory is empty</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MysticLegends;
