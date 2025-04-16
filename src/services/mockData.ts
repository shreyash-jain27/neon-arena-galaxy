
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

// Mock game data
export const games = [
  { 
    id: "neon-racer", 
    name: "Neon Racer", 
    description: "High-speed racing through futuristic neon landscapes",
    thumbnail: "https://placehold.co/300x200/4a148c/9c27b0?text=Neon+Racer"
  },
  { 
    id: "cyber-shooter", 
    name: "Cyber Shooter", 
    description: "First-person shooter in a dystopian cyberpunk world",
    thumbnail: "https://placehold.co/300x200/004d40/009688?text=Cyber+Shooter"
  },
  { 
    id: "galaxy-conquest", 
    name: "Galaxy Conquest", 
    description: "Strategy game of interstellar warfare and diplomacy",
    thumbnail: "https://placehold.co/300x200/0d47a1/2196f3?text=Galaxy+Conquest"
  },
  { 
    id: "pixel-adventure", 
    name: "Pixel Adventure", 
    description: "Retro platform adventure with modern twists",
    thumbnail: "https://placehold.co/300x200/bf360c/ff5722?text=Pixel+Adventure"
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
  friends: ["2", "3", "5"]
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
