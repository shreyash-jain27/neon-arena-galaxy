
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { currentUser, storeItems } from "../services/mockData";
import { Gamepad, Award, Gift, Calendar, Flame, Coins, Clock, User, Shield, Star, Trophy, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // XP Bar calculation
  const xpProgress = (currentUser.xp / currentUser.nextLevelXp) * 100;
  
  const claimDailyReward = () => {
    toast({
      title: "Daily Streak Bonus!",
      description: `You've claimed your day ${currentUser.streak} streak reward: 100 XP!`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gaming-darkest text-white">
      <Navbar />
      
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-neon-purple mb-4 flex items-center justify-center text-2xl font-bold">
                  {currentUser.username.slice(0, 2)}
                </div>
                <h2 className="text-2xl font-bold">{currentUser.username}</h2>
                <p className="text-white/60 mb-2">Member since {currentUser.joinDate}</p>
                
                <div className="w-full bg-gaming-darker rounded-full h-4 mt-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-neon-purple to-neon-pink h-full"
                    style={{ width: `${xpProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between w-full mt-1 text-sm">
                  <span>Level {currentUser.level}</span>
                  <span>{currentUser.xp} / {currentUser.nextLevelXp} XP</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gaming-highlight rounded-lg p-4 text-center">
                  <Flame className="mx-auto mb-2 text-red-400" size={24} />
                  <p className="text-sm text-white/60">Daily Streak</p>
                  <p className="text-xl font-bold">{currentUser.streak} Days</p>
                </div>
                
                <div className="bg-gaming-highlight rounded-lg p-4 text-center">
                  <Coins className="mx-auto mb-2 text-yellow-400" size={24} />
                  <p className="text-sm text-white/60">Coins</p>
                  <p className="text-xl font-bold">{currentUser.coins}</p>
                </div>
              </div>
              
              <button 
                onClick={claimDailyReward}
                className="w-full py-3 bg-neon-purple hover:bg-opacity-80 rounded-md font-medium text-white transition-colors flex items-center justify-center gap-2"
              >
                <Gift size={18} />
                Claim Daily Reward
              </button>
            </div>
            
            <div className="glass-card rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Award size={18} />
                Achievements
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gaming-highlight/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">First Victory</h4>
                    <p className="text-sm text-white/60">Win your first game</p>
                  </div>
                </div>
                
                <div className="bg-gaming-highlight/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Flame size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">On Fire</h4>
                    <p className="text-sm text-white/60">Win 5 games in a row</p>
                  </div>
                </div>
                
                <div className="bg-gaming-highlight/50 rounded-lg p-3 flex items-center gap-3 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">Unstoppable</h4>
                    <p className="text-sm text-white/60">Win 10 games in a row</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-lg overflow-hidden">
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-4 font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'overview' 
                      ? 'bg-gaming-highlight text-white' 
                      : 'hover:bg-gaming-highlight/50 text-white/70'
                  }`}
                >
                  <User size={18} />
                  Overview
                </button>
                
                <button 
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 py-4 font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'stats' 
                      ? 'bg-gaming-highlight text-white' 
                      : 'hover:bg-gaming-highlight/50 text-white/70'
                  }`}
                >
                  <Trophy size={18} />
                  Stats
                </button>
                
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className={`flex-1 py-4 font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'inventory' 
                      ? 'bg-gaming-highlight text-white' 
                      : 'hover:bg-gaming-highlight/50 text-white/70'
                  }`}
                >
                  <Gift size={18} />
                  Inventory
                </button>
                
                <button 
                  onClick={() => setActiveTab('friends')}
                  className={`flex-1 py-4 font-medium text-center transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'friends' 
                      ? 'bg-gaming-highlight text-white' 
                      : 'hover:bg-gaming-highlight/50 text-white/70'
                  }`}
                >
                  <Heart size={18} />
                  Friends
                </button>
              </div>
              
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Player Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gaming-highlight/30 p-5 rounded-lg">
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Gamepad size={18} />
                          Recent Activity
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Last Game</span>
                            <span>Cyber Shooter</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Last Played</span>
                            <span>2 hours ago</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Total Time</span>
                            <span>68 hours</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Favorite Game</span>
                            <span>Galaxy Conquest</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gaming-highlight/30 p-5 rounded-lg">
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Award size={18} />
                          Ranking
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Current Rank</span>
                            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">Diamond</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Global Position</span>
                            <span>#42</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Win Rate</span>
                            <span>78%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">K/D Ratio</span>
                            <span>3.2</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'stats' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Game Statistics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gaming-highlight/30 p-4 rounded-lg text-center">
                        <h4 className="text-sm text-white/60 mb-1">Games Played</h4>
                        <p className="text-2xl font-bold">248</p>
                      </div>
                      
                      <div className="bg-gaming-highlight/30 p-4 rounded-lg text-center">
                        <h4 className="text-sm text-white/60 mb-1">Wins</h4>
                        <p className="text-2xl font-bold text-green-400">194</p>
                      </div>
                      
                      <div className="bg-gaming-highlight/30 p-4 rounded-lg text-center">
                        <h4 className="text-sm text-white/60 mb-1">Losses</h4>
                        <p className="text-2xl font-bold text-red-400">54</p>
                      </div>
                    </div>
                    
                    <div className="bg-gaming-highlight/30 p-5 rounded-lg mb-6">
                      <h4 className="text-lg font-medium mb-4">Game Breakdown</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Neon Racer</span>
                            <span className="text-white/60">72 games</span>
                          </div>
                          <div className="w-full bg-gaming-darker h-3 rounded-full overflow-hidden">
                            <div className="bg-neon-blue h-full" style={{ width: '29%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Cyber Shooter</span>
                            <span className="text-white/60">95 games</span>
                          </div>
                          <div className="w-full bg-gaming-darker h-3 rounded-full overflow-hidden">
                            <div className="bg-neon-green h-full" style={{ width: '38%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Galaxy Conquest</span>
                            <span className="text-white/60">58 games</span>
                          </div>
                          <div className="w-full bg-gaming-darker h-3 rounded-full overflow-hidden">
                            <div className="bg-neon-purple h-full" style={{ width: '23%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Pixel Adventure</span>
                            <span className="text-white/60">23 games</span>
                          </div>
                          <div className="w-full bg-gaming-darker h-3 rounded-full overflow-hidden">
                            <div className="bg-neon-pink h-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'inventory' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Your Items</h3>
                      <div className="flex items-center gap-2 bg-gaming-highlight/50 px-3 py-1 rounded-full">
                        <Coins size={16} className="text-yellow-400" />
                        <span>{currentUser.coins} coins</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {currentUser.items.map((item, index) => (
                        <div key={index} className="bg-gaming-highlight/30 p-4 rounded-lg flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                            {item.includes("Premium") && <Star size={24} className="text-yellow-400" />}
                            {item.includes("Neon") && <Gamepad size={24} className="text-neon-blue" />}
                            {item.includes("VIP") && <Shield size={24} className="text-neon-purple" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{item}</h4>
                            <p className="text-sm text-white/60">Equipped</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">Store</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {storeItems.slice(0, 3).map(item => (
                        <div key={item.id} className="bg-gaming-highlight/30 p-4 rounded-lg flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                              {item.type === "skin" && <Gamepad size={24} className="text-neon-blue" />}
                              {item.type === "avatar" && <User size={24} className="text-neon-pink" />}
                              {item.type === "booster" && <Clock size={24} className="text-neon-green" />}
                              {item.type === "badge" && <Shield size={24} className="text-neon-purple" />}
                              {item.type === "emote" && <Heart size={24} className="text-red-400" />}
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-white/60">{item.description}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-gaming-card hover:bg-gaming-highlight border border-neon-purple/30 rounded-md flex items-center gap-2 transition-colors">
                            <Coins size={16} className="text-yellow-400" />
                            <span>{item.price}</span>
                          </button>
                        </div>
                      ))}
                      
                      <button className="text-center py-3 bg-gaming-highlight/50 hover:bg-gaming-highlight rounded-md text-white/70 hover:text-white transition-colors">
                        Visit Store
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'friends' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Friends</h3>
                    
                    <div className="bg-gaming-highlight/30 p-5 rounded-lg mb-6">
                      <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <User size={18} />
                        Online Friends (2)
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gaming-highlight/50">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-neon-purple flex items-center justify-center text-sm font-medium">
                                PA
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gaming-darker"></div>
                            </div>
                            <div>
                              <p className="font-medium">PixelAssassin</p>
                              <p className="text-xs text-white/60">Playing Cyber Shooter</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-neon-purple rounded-md text-sm">Invite</button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gaming-highlight/50">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-neon-blue flex items-center justify-center text-sm font-medium">
                                GG
                              </div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gaming-darker"></div>
                            </div>
                            <div>
                              <p className="font-medium">GalacticGamer</p>
                              <p className="text-xs text-white/60">Online</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-neon-purple rounded-md text-sm">Invite</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gaming-highlight/30 p-5 rounded-lg">
                      <h4 className="text-lg font-medium mb-4">Friend Requests (2)</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gaming-highlight/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon-green flex items-center justify-center text-sm font-medium">
                              CN
                            </div>
                            <p className="font-medium">CyberNinja</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-neon-green rounded-md text-sm">Accept</button>
                            <button className="px-3 py-1 bg-gaming-card rounded-md text-sm">Decline</button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gaming-highlight/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon-pink flex items-center justify-center text-sm font-medium">
                              BM
                            </div>
                            <p className="font-medium">ByteMaster</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-neon-green rounded-md text-sm">Accept</button>
                            <button className="px-3 py-1 bg-gaming-card rounded-md text-sm">Decline</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Profile;
