import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { updateGameProgress } from '../services/mockData';
import { Heart, Shield, Sword, Scroll, Gem, Skull, BookOpen, Compass, Zap } from 'lucide-react';

// Game types
interface Character {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  level: number;
  experience: number;
  gold: number;
  inventory: Item[];
  equipment: Equipment;
  abilities: Ability[];
}

interface Equipment {
  weapon: Item | null;
  armor: Item | null;
  accessory: Item | null;
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'potion' | 'quest' | 'treasure';
  value: number;
  effect?: {
    health?: number;
    attack?: number;
    defense?: number;
  };
  description: string;
  usable: boolean;
}

interface Ability {
  id: string;
  name: string;
  damage: number;
  cost: number;
  type: 'attack' | 'heal' | 'buff';
  description: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  options: string[];
  encounters?: string[];
  shops?: boolean;
  quests?: boolean;
  danger: number;
}

interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  experience: number;
  gold: number;
  loot?: Item[];
}

interface Quest {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'active' | 'completed';
  reward: {
    experience: number;
    gold: number;
    items?: Item[];
  };
  objective: {
    type: 'kill' | 'collect' | 'explore';
    target: string;
    amount: number;
    current: number;
  };
}

// Game constants
const INITIAL_CHARACTER: Character = {
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 5,
  level: 1,
  experience: 0,
  gold: 50,
  inventory: [
    {
      id: 'wooden-sword',
      name: 'Wooden Sword',
      type: 'weapon',
      value: 10,
      effect: { attack: 5 },
      description: 'A basic wooden sword. Not very effective, but better than nothing.',
      usable: false
    },
    {
      id: 'health-potion',
      name: 'Health Potion',
      type: 'potion',
      value: 20,
      effect: { health: 30 },
      description: 'Restores 30 health when consumed.',
      usable: true
    }
  ],
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  },
  abilities: [
    {
      id: 'basic-strike',
      name: 'Basic Strike',
      damage: 10,
      cost: 0,
      type: 'attack',
      description: 'A basic attack with your weapon.'
    }
  ]
};

// Game locations with enhanced descriptions and encounters
const LOCATIONS: Record<string, Location> = {
  village: {
    id: 'village',
    name: 'Village of Mistwood',
    description: 'A peaceful village at the edge of a mysterious forest. The gentle sounds of a blacksmith\'s hammer and children playing fill the air. This is your home.',
    options: ['forest', 'mountain', 'tavern'],
    danger: 0,
    shops: true,
    quests: true
  },
  forest: {
    id: 'forest',
    name: 'Enchanted Forest',
    description: 'A dense forest filled with magical creatures and hidden treasures. The leaves shimmer with an otherworldly glow, and you can hear strange whispers in the wind.',
    options: ['village', 'cave', 'river'],
    encounters: ['wolf', 'goblin', 'fairy'],
    danger: 3
  },
  mountain: {
    id: 'mountain',
    name: 'Dragonspire Mountain',
    description: 'A treacherous mountain where dragons are said to reside. The rocky path winds upward, and occasional scorch marks can be seen on larger boulders.',
    options: ['village', 'peak', 'cave'],
    encounters: ['troll', 'harpy', 'golem'],
    danger: 5
  },
  tavern: {
    id: 'tavern',
    name: 'Golden Goblet Tavern',
    description: 'A lively tavern where adventurers share tales of their journeys. The smell of hearty stew and ale fills the air, and a bard plays a cheerful tune in the corner.',
    options: ['village', 'rest', 'quest-board'],
    danger: 0,
    shops: true
  },
  cave: {
    id: 'cave',
    name: 'Crystal Cave',
    description: 'A dark cave filled with glowing crystals and dangerous monsters. The air is damp and cold, and strange echoes reverberate through the tunnels.',
    options: ['forest', 'mountain', 'depths'],
    encounters: ['spider', 'bat', 'troll'],
    danger: 6
  },
  river: {
    id: 'river',
    name: 'Silvermoon River',
    description: 'A magical river said to grant wishes to those pure of heart. The water sparkles like liquid silver in the moonlight, and rare flowers bloom along the banks.',
    options: ['forest', 'lake', 'fishing'],
    encounters: ['nixie', 'frog-warrior'],
    danger: 2
  },
  peak: {
    id: 'peak',
    name: 'Dragon\'s Peak',
    description: 'The summit of Dragonspire Mountain, home to the ancient dragon. The air is thin and hot, with steam venting from cracks in the rocks. A massive cave entrance looms ahead.',
    options: ['mountain', 'dragon-lair'],
    encounters: ['wyvern', 'dragon-cultist'],
    danger: 9
  },
  lake: {
    id: 'lake',
    name: 'Mirror Lake',
    description: 'A mystical lake where the water reflects not just your appearance, but your true self. The surface is perfectly still, creating flawless reflections of the surrounding landscape.',
    options: ['river', 'island'],
    encounters: ['water-elemental', 'truth-seeker'],
    danger: 4
  },
  'quest-board': {
    id: 'quest-board',
    name: 'Quest Board',
    description: 'A board with various quests posted by villagers and travelers. Some offer rewards of gold, others promise magical artifacts or knowledge.',
    options: ['tavern', 'accept-quest'],
    danger: 0,
    quests: true
  },
  'dragon-lair': {
    id: 'dragon-lair',
    name: 'Ancient Dragon\'s Lair',
    description: 'The cavernous home of the legendary dragon. Mountains of gold and treasures line the walls, and the smell of brimstone fills the air.',
    options: ['peak', 'treasure'],
    encounters: ['dragon'],
    danger: 10
  },
  depths: {
    id: 'depths',
    name: 'Abyssal Depths',
    description: 'The deepest part of the Crystal Cave, where ancient evil lurks in the darkness. The crystals here pulse with a sinister energy, and the air feels heavy with malice.',
    options: ['cave'],
    encounters: ['shadow-beast', 'cave-guardian'],
    danger: 8
  },
  island: {
    id: 'island',
    name: 'Forgotten Island',
    description: 'A small island in the center of Mirror Lake, said to hold ancient secrets. Ruins of an ancient civilization cover the island, with strange symbols carved into the stones.',
    options: ['lake', 'ruins'],
    encounters: ['guardian-statue', 'forgotten-mage'],
    danger: 7
  },
  ruins: {
    id: 'ruins',
    name: 'Ancient Ruins',
    description: 'The crumbling remains of a once-great civilization. Magic still lingers in the stones, and treasures await those brave enough to explore the depths.',
    options: ['island', 'sanctum'],
    encounters: ['animated-armor', 'ancient-construct'],
    danger: 8
  },
  sanctum: {
    id: 'sanctum',
    name: 'Arcane Sanctum',
    description: 'The heart of the ancient ruins, where powerful magic was once practiced. The air crackles with arcane energy, and glowing runes cover the walls and floor.',
    options: ['ruins'],
    encounters: ['archmage-spirit', 'chaotic-elemental'],
    danger: 9
  },
  rest: {
    id: 'rest',
    name: 'Tavern Room',
    description: 'A comfortable room at the Golden Goblet Tavern. The bed looks soft, and you could use some rest to restore your energy.',
    options: ['tavern'],
    danger: 0
  },
  fishing: {
    id: 'fishing',
    name: 'Fishing Spot',
    description: 'A peaceful spot on the Silvermoon River, perfect for fishing. The clear water allows you to see colorful fish swimming below the surface.',
    options: ['river'],
    danger: 1
  },
  treasure: {
    id: 'treasure',
    name: 'Dragon\'s Hoard',
    description: 'An immense treasure trove accumulated by the dragon over centuries. Gold coins, gems, and magical artifacts beyond counting are piled high.',
    options: ['dragon-lair'],
    danger: 10
  }
};

// Enemy types
const ENEMIES: Record<string, Omit<Enemy, 'id'>> = {
  wolf: {
    name: 'Dire Wolf',
    health: 30,
    maxHealth: 30,
    attack: 8,
    defense: 3,
    experience: 20,
    gold: 5,
    loot: [
      {
        id: 'wolf-fang',
        name: 'Wolf Fang',
        type: 'quest',
        value: 5,
        description: 'A sharp fang from a dire wolf. Could be useful for crafting or quests.',
        usable: false
      }
    ]
  },
  goblin: {
    name: 'Forest Goblin',
    health: 25,
    maxHealth: 25,
    attack: 7,
    defense: 2,
    experience: 15,
    gold: 10,
    loot: [
      {
        id: 'crude-dagger',
        name: 'Crude Dagger',
        type: 'weapon',
        value: 15,
        effect: { attack: 7 },
        description: 'A poorly-made but still effective dagger used by goblins.',
        usable: false
      }
    ]
  },
  troll: {
    name: 'Cave Troll',
    health: 80,
    maxHealth: 80,
    attack: 15,
    defense: 8,
    experience: 50,
    gold: 30,
    loot: [
      {
        id: 'troll-hide',
        name: 'Troll Hide',
        type: 'armor',
        value: 60,
        effect: { defense: 15 },
        description: 'The tough hide of a cave troll. Makes for sturdy armor.',
        usable: false
      }
    ]
  },
  spider: {
    name: 'Giant Spider',
    health: 40,
    maxHealth: 40,
    attack: 12,
    defense: 5,
    experience: 30,
    gold: 15,
    loot: [
      {
        id: 'spider-silk',
        name: 'Spider Silk',
        type: 'quest',
        value: 25,
        description: 'Strong, flexible silk from a giant spider. Valuable for crafting.',
        usable: false
      }
    ]
  },
  dragon: {
    name: 'Ancient Dragon',
    health: 300,
    maxHealth: 300,
    attack: 40,
    defense: 25,
    experience: 500,
    gold: 1000,
    loot: [
      {
        id: 'dragon-scale',
        name: 'Dragon Scale',
        type: 'armor',
        value: 500,
        effect: { defense: 30 },
        description: 'A nearly indestructible scale from an ancient dragon.',
        usable: false
      },
      {
        id: 'dragon-fang-sword',
        name: 'Dragon Fang Sword',
        type: 'weapon',
        value: 700,
        effect: { attack: 35 },
        description: 'A magnificent sword crafted from a dragon\'s fang.',
        usable: false
      }
    ]
  }
};

// Available quests
const QUESTS: Quest[] = [
  {
    id: 'wolf-hunt',
    name: 'Wolf Pack Menace',
    description: 'Wolves have been attacking villagers. Hunt down 3 dire wolves to secure the village.',
    status: 'available',
    reward: {
      experience: 100,
      gold: 50,
      items: [
        {
          id: 'leather-armor',
          name: 'Leather Armor',
          type: 'armor',
          value: 45,
          effect: { defense: 10 },
          description: 'Basic armor made from tanned leather.',
          usable: false
        }
      ]
    },
    objective: {
      type: 'kill',
      target: 'wolf',
      amount: 3,
      current: 0
    }
  },
  {
    id: 'crystal-collection',
    name: 'Magical Crystals',
    description: 'The village mage needs rare crystals from the Crystal Cave for his research.',
    status: 'available',
    reward: {
      experience: 150,
      gold: 75,
      items: [
        {
          id: 'magic-scroll',
          name: 'Scroll of Fireball',
          type: 'quest',
          value: 100,
          description: 'A scroll that teaches the Fireball ability.',
          usable: true
        }
      ]
    },
    objective: {
      type: 'collect',
      target: 'glowing-crystal',
      amount: 5,
      current: 0
    }
  },
  {
    id: 'dragon-slayer',
    name: 'Dragon Slayer',
    description: 'The ancient dragon has terrorized the region for centuries. Defeat it to become a legend.',
    status: 'available',
    reward: {
      experience: 1000,
      gold: 2000,
      items: [
        {
          id: 'dragon-amulet',
          name: 'Dragon Amulet',
          type: 'accessory',
          value: 1000,
          effect: { attack: 15, defense: 15 },
          description: 'An amulet infused with a dragon\'s power. Grants incredible strength and protection.',
          usable: false
        }
      ]
    },
    objective: {
      type: 'kill',
      target: 'dragon',
      amount: 1,
      current: 0
    }
  }
];

const MysticLegends = () => {
  // Game state
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [character, setCharacter] = useState<Character>(INITIAL_CHARACTER);
  const [currentLocation, setCurrentLocation] = useState('village');
  const [message, setMessage] = useState('Welcome to Mystic Legends!');
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [inCombat, setInCombat] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [activeQuests, setActiveQuests] = useState<Quest[]>([]);
  const [availableQuests, setAvailableQuests] = useState<Quest[]>(QUESTS);
  const [showInventory, setShowInventory] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Scroll to bottom of message log
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message, combatLog]);
  
  // Check for level up
  useEffect(() => {
    const requiredExp = character.level * 100;
    if (character.experience >= requiredExp && character.level < 10) {
      // Level up!
      setCharacter(prev => ({
        ...prev,
        level: prev.level + 1,
        maxHealth: prev.maxHealth + 20,
        health: prev.maxHealth + 20,
        attack: prev.attack + 5,
        defense: prev.defense + 3,
        experience: prev.experience - requiredExp
      }));
      
      setMessage(prev => `${prev}\nLevel up! You are now level ${character.level + 1}.`);
      
      toast({
        title: "Level Up!",
        description: `You've reached level ${character.level + 1}!`,
      });
    }
  }, [character.experience, character.level, toast]);
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCharacter(INITIAL_CHARACTER);
    setCurrentLocation('village');
    setMessage('You begin your adventure in the Village of Mistwood.');
    setInCombat(false);
    setCurrentEnemy(null);
    setCombatLog([]);
    setActiveQuests([]);
    setAvailableQuests(QUESTS);
    setShowInventory(false);
    setShowCharacter(false);
    setShowQuests(false);
  };
  
  // Handle location change
  const handleLocationChange = (location: string) => {
    if (inCombat) {
      setMessage("You can't leave while in combat!");
      return;
    }
    
    if (location === 'accept-quest') {
      handleQuestAccept();
      return;
    }
    
    if (location === 'rest') {
      handleRest();
      return;
    }
    
    if (location === 'fishing') {
      handleFishing();
      return;
    }
    
    if (location === 'treasure') {
      handleTreasure();
      return;
    }
    
    const newLocation = LOCATIONS[location];
    setCurrentLocation(location);
    setMessage(`You travel to ${newLocation.name}.\n${newLocation.description}`);
    
    // Random events
    const randomEvent = Math.random();
    
    if (randomEvent > 0.7 && newLocation.danger > 0) {
      // Combat encounter
      handleCombatEncounter(newLocation);
    } else if (randomEvent > 0.6 && location !== 'village' && location !== 'tavern') {
      // Find treasure
      handleFindTreasure();
    }
    
    // Update quests if needed
    if (activeQuests.some(q => q.objective.type === 'explore' && q.objective.target === location)) {
      updateQuestProgress('explore', location);
    }
    
    // Increase score for exploration
    setScore(prev => prev + 10);
  };
  
  // Handle combat encounter
  const handleCombatEncounter = (location: Location) => {
    if (!location.encounters || location.encounters.length === 0) return;
    
    const enemyType = location.encounters[Math.floor(Math.random() * location.encounters.length)];
    const enemyTemplate = ENEMIES[enemyType];
    
    if (!enemyTemplate) return;
    
    const enemy: Enemy = {
      id: `${enemyType}-${Date.now()}`,
      ...enemyTemplate
    };
    
    setCurrentEnemy(enemy);
    setInCombat(true);
    setMessage(prev => `${prev}\n\nYou encounter a ${enemy.name}!`);
    setCombatLog([`Combat begins with ${enemy.name}!`]);
  };
  
  // Handle finding treasure
  const handleFindTreasure = () => {
    const treasures = [
      {
        id: `gold-${Date.now()}`,
        name: 'Gold Coins',
        amount: Math.floor(Math.random() * 50) + 10,
        type: 'gold'
      },
      {
        id: 'health-potion',
        name: 'Health Potion',
        type: 'potion',
        value: 20,
        effect: { health: 30 },
        description: 'Restores 30 health when consumed.',
        usable: true
      },
      {
        id: 'magic-scroll',
        name: 'Magic Scroll',
        type: 'quest',
        value: 50,
        description: 'A scroll with ancient writing. Might be valuable to a mage.',
        usable: false
      },
      {
        id: 'ruby-amulet',
        name: 'Ruby Amulet',
        type: 'accessory',
        value: 100,
        effect: { attack: 5 },
        description: 'An amulet with a lustrous ruby that enhances your power.',
        usable: false
      }
    ];
    
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    
    if (treasure.type === 'gold') {
      setCharacter(prev => ({
        ...prev,
        gold: prev.gold + treasure.amount
      }));
      setMessage(prev => `${prev}\n\nYou found ${treasure.amount} gold coins!`);
    } else {
      setCharacter(prev => ({
        ...prev,
        inventory: [...prev.inventory, treasure as Item]
      }));
      setMessage(prev => `${prev}\n\nYou found a ${treasure.name}!`);
    }
    
    setScore(prev => prev + 50);
  };
  
  // Handle quest accept
  const handleQuestAccept = () => {
    if (availableQuests.length === 0) {
      setMessage("There are no quests available at the moment.");
      return;
    }
    
    const quest = availableQuests[0];
    setAvailableQuests(prev => prev.filter(q => q.id !== quest.id));
    
    const updatedQuest = { ...quest, status: 'active' as const };
    setActiveQuests(prev => [...prev, updatedQuest]);
    
    setMessage(`You accepted a quest: ${quest.name}\n${quest.description}`);
    setScore(prev => prev + 25);
  };
  
  // Update quest progress
  const updateQuestProgress = (type: 'kill' | 'collect' | 'explore', target: string) => {
    let questCompleted = false;
    
    setActiveQuests(prev => 
      prev.map(quest => {
        if (quest.objective.type === type && quest.objective.target === target) {
          const updatedCurrent = quest.objective.current + 1;
          const isCompleted = updatedCurrent >= quest.objective.amount;
          
          if (isCompleted) {
            questCompleted = true;
            
            // Add rewards
            setCharacter(char => ({
              ...char,
              experience: char.experience + quest.reward.experience,
              gold: char.gold + quest.reward.gold,
              inventory: quest.reward.items 
                ? [...char.inventory, ...quest.reward.items]
                : char.inventory
            }));
            
            setMessage(prev => `${prev}\n\nQuest completed: ${quest.name}! You received ${quest.reward.experience} XP and ${quest.reward.gold} gold.`);
            
            setScore(prev => prev + quest.reward.experience);
            
            return {
              ...quest,
              status: 'completed',
              objective: {
                ...quest.objective,
                current: updatedCurrent
              }
            };
          }
          
          return {
            ...quest,
            objective: {
              ...quest.objective,
              current: updatedCurrent
            }
          };
        }
        return quest;
      })
    );
    
    if (questCompleted) {
      toast({
        title: "Quest Completed!",
        description: "You've completed a quest and received rewards!",
      });
    }
  };
  
  // Handle resting at the tavern
  const handleRest = () => {
    setCharacter(prev => ({
      ...prev,
      health: prev.maxHealth,
      gold: prev.gold - 10
    }));
    
    setMessage("You rest at the tavern, restoring your health completely. It cost you 10 gold.");
  };
  
  // Handle fishing activity
  const handleFishing = () => {
    const success = Math.random() > 0.5;
    
    if (success) {
      const fish = {
        id: `fish-${Date.now()}`,
        name: 'Silvermoon Fish',
        type: 'potion' as const,
        value: 15,
        effect: { health: 20 },
        description: 'A fresh fish that restores some health when eaten.',
        usable: true
      };
      
      setCharacter(prev => ({
        ...prev,
        inventory: [...prev.inventory, fish]
      }));
      
      setMessage("You catch a gleaming Silvermoon Fish! It looks delicious and might restore some health.");
    } else {
      setMessage("You spend some time fishing, but don't catch anything. The peaceful scenery was nice, though.");
    }
  };
  
  // Handle dragon's treasure
  const handleTreasure = () => {
    // Only accessible if dragon is defeated
    const dragonQuestCompleted = activeQuests.some(q => 
      q.id === 'dragon-slayer' && q.status === 'completed'
    );
    
    if (!dragonQuestCompleted) {
      setMessage("You approach the treasure, but the dragon attacks! Defeat the dragon first to claim its hoard.");
      handleCombatEncounter(LOCATIONS['dragon-lair']);
      return;
    }
    
    const treasures = [
      {
        id: 'dragon-crown',
        name: 'Crown of Dragonfire',
        type: 'accessory' as const,
        value: 1000,
        effect: { attack: 20, defense: 10 },
        description: 'A crown forged from dragon gold that grants immense power.',
        usable: false
      },
      {
        id: 'ancient-tome',
        name: 'Ancient Tome of Magic',
        type: 'quest' as const,
        value: 800,
        description: 'A book containing powerful spells from a forgotten age.',
        usable: true
      }
    ];
    
    setCharacter(prev => ({
      ...prev,
      gold: prev.gold + 2000,
      inventory: [...prev.inventory, ...treasures]
    }));
    
    setMessage("You claim the dragon's hoard! You find 2000 gold coins and several magical artifacts!");
    setScore(prev => prev + 1000);
    
    toast({
      title: "Legendary Achievement!",
      description: "You've claimed the dragon's hoard and become a legend!",
    });
  };
  
  // Combat actions
  const handleCombatAction = (action: 'attack' | 'ability' | 'item' | 'flee', itemId?: string, abilityId?: string) => {
    if (!inCombat || !currentEnemy) return;
    
    if (action === 'flee') {
      const fleeChance = Math.random();
      if (fleeChance > 0.6) {
        setInCombat(false);
        setCurrentEnemy(null);
        setCombatLog(prev => [...prev, "You successfully fled from combat!"]);
        setMessage(prev => `${prev}\nYou managed to escape from the ${currentEnemy.name}!`);
      } else {
        setCombatLog(prev => [...prev, "You failed to flee!"]);
        handleEnemyAttack();
      }
      return;
    }
    
    if (action === 'item' && itemId) {
      const item = character.inventory.find(i => i.id === itemId);
      if (item && item.usable) {
        if (item.effect?.health) {
          setCharacter(prev => ({
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + item.effect!.health!),
            inventory: prev.inventory.filter(i => i.id !== itemId)
          }));
          setCombatLog(prev => [...prev, `You used ${item.name} and restored ${item.effect.health} health!`]);
        }
        handleEnemyAttack();
      }
      return;
    }
    
    // Attack or ability
    let damage = character.attack;
    let description = "You attack";
    
    if (action === 'ability' && abilityId) {
      const ability = character.abilities.find(a => a.id === abilityId);
      if (ability) {
        damage = ability.damage + character.attack;
        description = `You use ${ability.name}`;
      }
    }
    
    // Calculate actual damage with defense reduction
    const actualDamage = Math.max(1, damage - currentEnemy.defense);
    const newEnemyHealth = Math.max(0, currentEnemy.health - actualDamage);
    
    setCombatLog(prev => [...prev, `${description} the ${currentEnemy.name} for ${actualDamage} damage!`]);
    setCurrentEnemy(prev => prev ? { ...prev, health: newEnemyHealth } : null);
    
    if (newEnemyHealth <= 0) {
      // Enemy defeated
      handleCombatVictory();
      return;
    }
    
    // Enemy attacks back
    handleEnemyAttack();
  };
  
  // Handle enemy attack
  const handleEnemyAttack = () => {
    if (!currentEnemy) return;
    
    // Calculate damage
    const damage = Math.max(1, currentEnemy.attack - character.defense);
    const newHealth = Math.max(0, character.health - damage);
    
    setCombatLog(prev => [...prev, `The ${currentEnemy.name} attacks you for ${damage} damage!`]);
    setCharacter(prev => ({ ...prev, health: newHealth }));
    
    if (newHealth <= 0) {
      // Player defeated
      handleCombatDefeat();
    }
  };
  
  // Handle combat victory
  const handleCombatVictory = () => {
    if (!currentEnemy) return;
    
    setCombatLog(prev => [...prev, `You defeated the ${currentEnemy.name}!`, 
      `You gained ${currentEnemy.experience} experience and ${currentEnemy.gold} gold!`]);
    
    setMessage(prev => `${prev}\nYou defeated the ${currentEnemy.name}!`);
    
    // Add experience, gold, and possibly loot
    const lootItems = currentEnemy.loot || [];
    setCharacter(prev => ({
      ...prev,
      experience: prev.experience + currentEnemy.experience,
      gold: prev.gold + currentEnemy.gold,
      inventory: [...prev.inventory, ...lootItems]
    }));
    
    // Update quest progress if killing this enemy type is a quest objective
    updateQuestProgress('kill', currentEnemy.name.toLowerCase().replace(/\s+/g, '-'));
    
    // Add score based on enemy difficulty
    setScore(prev => prev + currentEnemy.experience);
    
    setInCombat(false);
    setCurrentEnemy(null);
  };
  
  // Handle combat defeat
  const handleCombatDefeat = () => {
    setCombatLog(prev => [...prev, "You have been defeated!"]);
    
    setGameOver(true);
    
    // Update progress
    updateGameProgress('mystic-legends', score);
    
    toast({
      title: "Game Over!",
      description: `You have been defeated! Final score: ${score}. You earned 50 XP!`,
    });
  };
  
  // Use item from inventory
  const useItem = (itemId: string) => {
    const item = character.inventory.find(i => i.id === itemId);
    
    if (item && item.usable) {
      // Handle different item effects
      if (item.effect?.health) {
        setCharacter(prev => ({
          ...prev,
          health: Math.min(prev.maxHealth, prev.health + item.effect!.health!),
          inventory: prev.inventory.filter(i => i.id !== itemId)
        }));
        
        setMessage(prev => `${prev}\nYou used a ${item.name} and restored ${item.effect.health} health!`);
      }
    }
  };
  
  // Equip item
  const equipItem = (itemId: string) => {
    const item = character.inventory.find(i => i.id === itemId);
    
    if (item && (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory')) {
      // Remove currently equipped item of same type and put it back in inventory
      let updatedInventory = [...character.inventory];
      const currentEquipped = character.equipment[item.type];
      
      if (currentEquipped) {
        updatedInventory = [...updatedInventory, currentEquipped];
      }
      
      // Remove new item from inventory and equip it
      updatedInventory = updatedInventory.filter(i => i.id !== itemId);
      
      setCharacter(prev => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          [item.type]: item
        },
        inventory: updatedInventory
      }));
      
      setMessage(prev => `${prev}\nYou equipped ${item.name}!`);
    }
  };
  
  // Toggle UI panels
  const toggleInventory = () => setShowInventory(prev => !prev);
  const toggleCharacter = () => setShowCharacter(prev => !prev);
  const toggleQuests = () => setShowQuests(prev => !prev);
  
  // Calculate total attack and defense from equipment
  const getTotalAttack = () => {
    let total = character.attack;
    
    if (character.equipment.weapon && character.equipment.weapon.effect?.attack) {
      total += character.equipment.weapon.effect.attack;
    }
    
    if (character.equipment.accessory && character.equipment.accessory.effect?.attack) {
      total += character.equipment.accessory.effect.attack;
    }
    
    return total;
  };
  
  const getTotalDefense = () => {
    let total = character.defense;
    
    if (character.equipment.armor && character.equipment.armor.effect?.defense) {
      total += character.equipment.armor.effect.defense;
    }
    
    if (character.equipment.accessory && character.equipment.accessory.effect?.defense) {
      total += character.equipment.accessory.effect.defense;
    }
    
    return total;
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
              <p className="text-white/90 mb-1">Level: {character.level}</p>
              <p className="text-white/90 mb-3">Gold: {character.gold}</p>
              <p className="text-white/70">You earned 50 XP!</p>
            </div>
          )}
          
          {!gameOver && (
            <p className="text-white/70 mb-6 text-center max-w-md px-4">
              Embark on an epic journey through a magical realm. Explore locations, fight monsters,
              complete quests, and become a legend!
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
            <div className="flex items-center px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              <Heart size={16} className="text-red-500 fill-red-500 mr-1" />
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden ml-1">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${(character.health / character.maxHealth) * 100}%`,
                    backgroundColor: character.health > character.maxHealth * 0.6 ? '#10b981' : 
                      character.health > character.maxHealth * 0.3 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <span className="ml-2">{character.health}/{character.maxHealth}</span>
            </div>
            
            <div className="px-3 py-1 bg-gaming-dark/80 rounded-full text-white font-medium">
              Score: {score}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex space-x-2 mb-4">
            <button 
              onClick={toggleInventory}
              className={`px-3 py-1 rounded text-white text-sm flex items-center ${
                showInventory ? 'bg-purple-600' : 'bg-purple-600/60 hover:bg-purple-600'
              }`}
            >
              <Gem size={12} className="mr-1" /> Inventory
            </button>
            <button 
              onClick={toggleCharacter}
              className={`px-3 py-1 rounded text-white text-sm flex items-center ${
                showCharacter ? 'bg-purple-600' : 'bg-purple-600/60 hover:bg-purple-600'
              }`}
            >
              <Sword size={14} className="mr-1" /> Character
            </button>
            <button 
              onClick={toggleQuests}
              className={`px-3 py-1 rounded text-white text-sm flex items-center ${
                showQuests ? 'bg-purple-600' : 'bg-purple-600/60 hover:bg-purple-600'
              }`}
            >
              <Scroll size={14} className="mr-1" /> Quests {activeQuests.length > 0 && `(${activeQuests.length})`}
            </button>
          </div>
          
          {/* Game content */}
          <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
            {/* Main game display */}
            <div className={`transition-all duration-300 ${
              showInventory || showCharacter || showQuests ? 'h-1/2' : 'h-full'
            }`}>
              {inCombat ? (
                <div className="bg-gaming-dark/50 p-4 rounded-lg h-full flex flex-col">
                  <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center">
                    <Skull size={18} className="mr-2" />
                    Combat: {currentEnemy?.name}
                  </h3>
                  
                  <div className="flex justify-between mb-3">
                    <div className="flex flex-col">
                      <div className="text-white/90 text-sm mb-1">Enemy Health</div>
                      <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-red-500"
                          style={{ 
                            width: currentEnemy ? `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` : '0%'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="text-white/90 text-sm">
                      <div>Attack: {currentEnemy?.attack}</div>
                      <div>Defense: {currentEnemy?.defense}</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-3 rounded mb-4 flex-grow overflow-y-auto text-white/90 space-y-1">
                    {combatLog.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCombatAction('attack')}
                      className="px-3 py-1 bg-red-600/70 hover:bg-red-600 rounded text-white text-sm flex items-center"
                    >
                      <Sword size={14} className="mr-1" /> Attack
                    </button>
                    
                    {character.abilities.length > 0 && character.abilities.map(ability => (
                      <button
                        key={ability.id}
                        onClick={() => handleCombatAction('ability', undefined, ability.id)}
                        className="px-3 py-1 bg-blue-600/70 hover:bg-blue-600 rounded text-white text-sm flex items-center"
                      >
                        <Zap size={14} className="mr-1" /> {ability.name}
                      </button>
                    ))}
                    
                    {character.inventory.some(item => item.usable && item.effect?.health) && (
                      <button
                        onClick={() => {
                          const potion = character.inventory.find(item => 
                            item.usable && item.effect?.health
                          );
                          if (potion) handleCombatAction('item', potion.id);
                        }}
                        className="px-3 py-1 bg-green-600/70 hover:bg-green-600 rounded text-white text-sm flex items-center"
                      >
                        <Heart size={14} className="mr-1" /> Use Potion
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleCombatAction('flee')}
                      className="px-3 py-1 bg-gray-600/70 hover:bg-gray-600 rounded text-white text-sm"
                    >
                      Flee
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gaming-dark/50 p-4 rounded-lg h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-400 mb-1 flex items-center">
                        <Compass size={18} className="mr-2" />
                        {LOCATIONS[currentLocation].name}
                      </h3>
                      <div className="text-white/70 text-sm mb-2">
                        Danger Level: {LOCATIONS[currentLocation].danger > 0 ? '⚠️'.repeat(Math.min(LOCATIONS[currentLocation].danger, 5)) : 'Safe'}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="text-white/90 text-xs flex items-center bg-gaming-dark/50 px-2 py-1 rounded">
                        <Gem size={12} className="text-yellow-400 mr-1" />
                        Gold: {character.gold}
                      </div>
                      <div className="text-white/90 text-xs flex items-center bg-gaming-dark/50 px-2 py-1 rounded">
                        <BookOpen size={12} className="text-blue-400 mr-1" />
                        Level: {character.level}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black/30 p-3 rounded mb-4 flex-grow overflow-y-auto whitespace-pre-line text-white/90">
                    {message}
                    <div ref={messageEndRef} />
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">Where will you go?</h4>
                  <div className="flex flex-wrap gap-2">
                    {LOCATIONS[currentLocation].options.map(location => (
                      <button
                        key={location}
                        onClick={() => handleLocationChange(location)}
                        className="px-3 py-1 bg-purple-600/70 hover:bg-purple-600 rounded text-white text-sm"
                      >
                        {location === 'accept-quest' ? 'Accept Quest' : LOCATIONS[location].name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Panels */}
            {(showInventory || showCharacter || showQuests) && (
              <div className="h-1/2 grid grid-cols-1 gap-4">
                {/* Inventory panel */}
                {showInventory && (
                  <div className="bg-gaming-dark/50 p-4 rounded-lg overflow-y-auto">
                    <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
                      <Gem size={16} className="mr-2" />
                      Inventory
                    </h3>
                    
                    {character.inventory.length > 0 ? (
                      <div className="space-y-2">
                        {character.inventory.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-2 bg-black/20 rounded group">
                            <div>
                              <div className="text-white flex items-center">
                                {item.name}
                                <span className="text-xs text-white/50 ml-2">{item.type}</span>
                              </div>
                              <div className="text-white/60 text-xs">{item.description}</div>
                            </div>
                            <div className="flex gap-1">
                              {item.usable && (
                                <button
                                  onClick={() => useItem(item.id)}
                                  className="px-2 py-1 bg-green-600/70 hover:bg-green-600 rounded text-xs text-white"
                                >
                                  Use
                                </button>
                              )}
                              {(item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') && (
                                <button
                                  onClick={() => equipItem(item.id)}
                                  className="px-2 py-1 bg-blue-600/70 hover:bg-blue-600 rounded text-xs text-white"
                                >
                                  Equip
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/50 text-center">Your inventory is empty</p>
                    )}
                  </div>
                )}
                
                {/* Character panel */}
                {showCharacter && (
                  <div className="bg-gaming-dark/50 p-4 rounded-lg overflow-y-auto">
                    <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
                      <Sword size={16} className="mr-2" />
                      Character
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-3 rounded">
                        <h4 className="text-white/90 font-medium mb-2">Stats</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/70">Level:</span>
                            <span className="text-white">{character.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Experience:</span>
                            <span className="text-white">{character.experience}/{character.level * 100}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Attack:</span>
                            <span className="text-white">{getTotalAttack()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Defense:</span>
                            <span className="text-white">{getTotalDefense()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Gold:</span>
                            <span className="text-white">{character.gold}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 p-3 rounded">
                        <h4 className="text-white/90 font-medium mb-2">Equipment</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Weapon:</span>
                            <span className="text-white">{character.equipment.weapon?.name || 'None'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Armor:</span>
                            <span className="text-white">{character.equipment.armor?.name || 'None'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Accessory:</span>
                            <span className="text-white">{character.equipment.accessory?.name || 'None'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 p-3 rounded col-span-2">
                        <h4 className="text-white/90 font-medium mb-2">Abilities</h4>
                        <div className="space-y-2">
                          {character.abilities.map(ability => (
                            <div key={ability.id} className="flex justify-between items-center">
                              <div>
                                <div className="text-white">{ability.name}</div>
                                <div className="text-white/60 text-xs">{ability.description}</div>
                              </div>
                              <div className="text-white/80 text-xs">
                                Damage: {ability.damage}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quests panel */}
                {showQuests && (
                  <div className="bg-gaming-dark/50 p-4 rounded-lg overflow-y-auto">
                    <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center">
                      <Scroll size={16} className="mr-2" />
                      Quests
                    </h3>
                    
                    {activeQuests.length > 0 ? (
                      <div className="space-y-3">
                        {activeQuests.map(quest => (
                          <div key={quest.id} className="p-3 bg-black/20 rounded">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-white font-medium">{quest.name}</h4>
                              <div className={`text-xs px-2 py-0.5 rounded ${
                                quest.status === 'completed' ? 'bg-green-600/50 text-green-100' : 
                                'bg-yellow-600/50 text-yellow-100'
                              }`}>
                                {quest.status === 'completed' ? 'Completed' : 'Active'}
                              </div>
                            </div>
                            <p className="text-white/70 text-sm mb-2">{quest.description}</p>
                            
                            <div className="text-xs text-white/60 space-y-1">
                              <div className="flex justify-between">
                                <span>Objective:</span>
                                <span>{quest.objective.current}/{quest.objective.amount} {quest.objective.type === 'kill' ? 'defeated' : quest.objective.type === 'collect' ? 'collected' : 'explored'}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span>Rewards:</span>
                                <span>{quest.reward.experience} XP, {quest.reward.gold} gold</span>
                              </div>
                              
                              {quest.reward.items && quest.reward.items.length > 0 && (
                                <div>
                                  <span>Item rewards: </span>
                                  {quest.reward.items.map(item => item.name).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/50 text-center">You have no active quests</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MysticLegends;
