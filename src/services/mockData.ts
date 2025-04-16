
// Mock player data
export const players = [
  { id: "1", name: "NeonWarrior", score: 2850, rank: "Diamond", wins: 42, losses: 12 },
  { id: "2", name: "PixelAssassin", score: 2340, rank: "Diamond", wins: 36, losses: 18 },
  { id: "3", name: "GalacticGamer", score: 2120, rank: "Platinum", wins: 31, losses: 15 },
  { id: "4", name: "CyberNinja", score: 1980, rank: "Platinum", wins: 28, losses: 16 },
  { id: "5", name: "QuantumQueen", score: 1750, rank: "Gold", wins: 25, losses: 20 },
  { id: "6", name: "NeonShadow", score: 1640, rank: "Gold", wins: 22, losses: 19 },
  { id: "7", name: "ByteMaster", score: 1490, rank: "Silver", wins: 18, losses: 22 },
  { id: "8", name: "LaserWolf", score: 1320, rank: "Silver", wins: 15, losses: 25 },
  { id: "9", name: "FrostByte", score: 1150, rank: "Bronze", wins: 12, losses: 28 },
  { id: "10", name: "VirtualViper", score: 980, rank: "Bronze", wins: 8, losses: 32 },
];

// Mock game data - expanding with more details
export const games = [
  { 
    id: "cybernetic-assault", 
    name: "Cybernetic Assault", 
    description: "A fast-paced action game in a dystopian cyberpunk world. Battle your way through enemy cyborgs and reclaim the city.",
    thumbnail: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    category: "Action",
    rating: 4.8,
    players: "20k+",
    highscore: 95000,
    lastPlayed: new Date(Date.now() - 86400000 * 2),
    progress: 75,
    achievements: [
      { id: "perfect-run", name: "Perfect Run", description: "Complete a level without taking damage", unlocked: true },
      { id: "speed-demon", name: "Speed Demon", description: "Complete the game under 2 hours", unlocked: false }
    ]
  },
  { 
    id: "neon-racer-x", 
    name: "Neon Racer X", 
    description: "High-speed racing through futuristic neon landscapes. Customize your vehicle and compete in global tournaments.",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    category: "Racing",
    rating: 4.6,
    players: "15k+",
    highscore: 127500,
    lastPlayed: new Date(Date.now() - 86400000 * 5),
    progress: 45,
    achievements: [
      { id: "drift-king", name: "Drift King", description: "Perform a perfect drift for 5 seconds", unlocked: true },
      { id: "speed-demon", name: "Speed Demon", description: "Reach top speed in 3 seconds", unlocked: true },
      { id: "champion", name: "Champion", description: "Win the World Championship", unlocked: false }
    ]
  },
  { 
    id: "galaxy-conquest", 
    name: "Galaxy Conquest", 
    description: "Strategy game of interstellar warfare and diplomacy. Expand your empire and conquer the galaxy.",
    thumbnail: "https://images.unsplash.com/photo-1614294149013-6b284299b59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "Strategy",
    rating: 4.9,
    players: "18k+",
    highscore: 348900,
    lastPlayed: new Date(Date.now() - 86400000 * 1),
    progress: 90,
    achievements: [
      { id: "diplomat", name: "Master Diplomat", description: "Form 10 alliances in a single game", unlocked: false },
      { id: "conqueror", name: "Galactic Conqueror", description: "Control 50 star systems", unlocked: true }
    ]
  },
  { 
    id: "mystic-legends", 
    name: "Mystic Legends", 
    description: "An immersive RPG with stunning visuals and rich storyline. Embark on an epic journey across magical realms.",
    thumbnail: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    category: "RPG",
    rating: 4.7,
    players: "12k+",
    highscore: 235000,
    lastPlayed: new Date(Date.now() - 86400000 * 8),
    progress: 30,
    achievements: [
      { id: "dragon-slayer", name: "Dragon Slayer", description: "Defeat the ancient dragon", unlocked: false },
      { id: "master-mage", name: "Master Mage", description: "Learn all magic spells", unlocked: false }
    ]
  },
  { 
    id: "space-warriors", 
    name: "Space Warriors", 
    description: "Intense space combat simulator with stunning graphics and realistic physics.",
    thumbnail: "https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "Action",
    rating: 4.3,
    players: "8k+",
    highscore: 78500,
    lastPlayed: null,
    progress: 0,
    achievements: [
      { id: "ace-pilot", name: "Ace Pilot", description: "Shoot down 50 enemy ships", unlocked: false },
      { id: "survivor", name: "Survivor", description: "Complete the campaign on hard difficulty", unlocked: false }
    ]
  },
  { 
    id: "stealth-ninja", 
    name: "Stealth Ninja", 
    description: "Stealth action game where precision and timing are everything. Move silently, strike swiftly.",
    thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    category: "Action",
    rating: 4.5,
    players: "10k+",
    highscore: 112000,
    lastPlayed: null,
    progress: 0,
    achievements: [
      { id: "shadow-master", name: "Shadow Master", description: "Complete a mission without being detected", unlocked: false },
      { id: "silent-assassin", name: "Silent Assassin", description: "Eliminate 100 enemies with stealth kills", unlocked: false }
    ]
  }
];

// Mock chat messages
export const chatMessages = [
  { id: "1", sender: "NeonWarrior", text: "Has anyone beaten the final boss in Cyber Shooter?", timestamp: new Date(Date.now() - 3600000) },
  { id: "2", sender: "PixelAssassin", text: "Yeah, use the plasma grenades when he goes into rage mode", timestamp: new Date(Date.now() - 3500000) },
  { id: "3", sender: "GalacticGamer", text: "Anyone want to join a Galaxy Conquest match?", timestamp: new Date(Date.now() - 3000000) },
  { id: "4", sender: "CyberNinja", text: "I'm in, send me an invite", timestamp: new Date(Date.now() - 2900000) },
  { id: "5", sender: "QuantumQueen", text: "New highscore on Neon Racer! 258,450 points!", timestamp: new Date(Date.now() - 2500000) },
  { id: "6", sender: "NeonShadow", text: "That's insane! My best is only 180k", timestamp: new Date(Date.now() - 2400000) },
];

// Mock user profile
export const currentUser = {
  id: "1",
  username: "NeonWarrior",
  avatar: "https://placehold.co/100x100/9c27b0/ffffff?text=NW",
  level: 42,
  xp: 4250,
  nextLevelXp: 5000,
  coins: 2800,
  streak: 5,
  joinDate: "2023-01-15",
  items: ["Premium Avatar", "Neon Skin Pack", "VIP Badge"],
  friends: ["2", "3", "5"],
  // Game progress tracking
  gameProgress: [
    { gameId: "cybernetic-assault", timePlayed: 2450, highscore: 95000, achievements: 1, lastPlayed: new Date(Date.now() - 86400000 * 2) },
    { gameId: "neon-racer-x", timePlayed: 1280, highscore: 127500, achievements: 2, lastPlayed: new Date(Date.now() - 86400000 * 5) },
    { gameId: "galaxy-conquest", timePlayed: 3650, highscore: 348900, achievements: 1, lastPlayed: new Date(Date.now() - 86400000 * 1) },
    { gameId: "mystic-legends", timePlayed: 890, highscore: 235000, achievements: 0, lastPlayed: new Date(Date.now() - 86400000 * 8) }
  ]
};

// Mock Friend Requests
export const friendRequests = [
  { id: "1", senderId: "4", senderName: "CyberNinja", status: "pending" },
  { id: "2", senderId: "7", senderName: "ByteMaster", status: "pending" }
];

// Mock store items
export const storeItems = [
  { id: "1", name: "Galaxy Skin Pack", description: "Exclusive galaxy-themed skins for all games", price: 1200, type: "skin" },
  { id: "2", name: "Premium Avatar Pack", description: "15 animated premium avatars", price: 800, type: "avatar" },
  { id: "3", name: "XP Booster (7 days)", description: "Earn 2x XP for a week", price: 1500, type: "booster" },
  { id: "4", name: "VIP Badge", description: "Show off your VIP status", price: 2000, type: "badge" },
  { id: "5", name: "Chat Emotes Pack", description: "50+ animated chat emotes", price: 500, type: "emote" }
];

// Game progress tracking service
export const updateGameProgress = (gameId: string, score: number) => {
  const gameProgress = currentUser.gameProgress.find(progress => progress.gameId === gameId);
  
  if (gameProgress) {
    // Update existing progress
    gameProgress.timePlayed += 60; // Add 1 minute of play time
    gameProgress.lastPlayed = new Date();
    if (score > gameProgress.highscore) {
      gameProgress.highscore = score;
    }
  } else {
    // Create new progress entry
    currentUser.gameProgress.push({
      gameId,
      timePlayed: 60,
      highscore: score,
      achievements: 0,
      lastPlayed: new Date()
    });
  }
  
  // Add XP for playing
  currentUser.xp += 50;
  if (currentUser.xp >= currentUser.nextLevelXp) {
    currentUser.level += 1;
    currentUser.xp = currentUser.xp - currentUser.nextLevelXp;
    currentUser.nextLevelXp = Math.floor(currentUser.nextLevelXp * 1.2);
  }
  
  return { updatedProgress: currentUser.gameProgress, xp: currentUser.xp, level: currentUser.level };
};
