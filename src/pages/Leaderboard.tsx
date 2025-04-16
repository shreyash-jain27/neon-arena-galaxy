
import React, { useState } from "react";
import { players } from "../services/mockData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trophy, Award, Users, Medal } from "lucide-react";

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("score");
  
  const sortedPlayers = [...players].sort((a, b) => {
    if (selectedCategory === "score") return b.score - a.score;
    if (selectedCategory === "wins") return b.wins - a.wins;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gaming-darkest text-white">
      <Navbar />
      
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-neon-glow">Leaderboard</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Compete with the best players in the Neon Arena. Rise through the ranks and claim your place at the top!
          </p>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => setSelectedCategory("score")}
            className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
              selectedCategory === "score" 
                ? "bg-neon-purple text-white" 
                : "bg-gaming-card hover:bg-gaming-highlight text-white/70"
            }`}
          >
            <Trophy size={18} />
            <span>Top Scores</span>
          </button>
          
          <button 
            onClick={() => setSelectedCategory("wins")}
            className={`px-6 py-3 rounded-md flex items-center gap-2 transition-all ${
              selectedCategory === "wins" 
                ? "bg-neon-purple text-white" 
                : "bg-gaming-card hover:bg-gaming-highlight text-white/70"
            }`}
          >
            <Award size={18} />
            <span>Most Wins</span>
          </button>
        </div>
        
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="bg-gaming-highlight p-4 border-b border-white/10 flex items-center">
            <div className="w-12 text-center font-bold">#</div>
            <div className="flex-1 font-bold">Player</div>
            {selectedCategory === "score" && <div className="w-32 text-right font-bold">Score</div>}
            {selectedCategory === "wins" && (
              <>
                <div className="w-24 text-right font-bold">Wins</div>
                <div className="w-24 text-right font-bold">Losses</div>
              </>
            )}
            <div className="w-24 text-right font-bold">Rank</div>
          </div>
          
          <div>
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className="flex items-center p-4 border-b border-white/5 hover:bg-gaming-highlight/50 transition-colors"
              >
                <div className="w-12 text-center">
                  {index === 0 && <Trophy className="mx-auto text-yellow-400" size={20} />}
                  {index === 1 && <Trophy className="mx-auto text-gray-400" size={20} />}
                  {index === 2 && <Trophy className="mx-auto text-amber-600" size={20} />}
                  {index > 2 && <span className="text-white/50">{index + 1}</span>}
                </div>
                
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-purple/30 flex items-center justify-center text-sm font-medium">
                    {player.name.slice(0, 2)}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                
                {selectedCategory === "score" && (
                  <div className="w-32 text-right font-mono text-neon-blue">
                    {player.score.toLocaleString()}
                  </div>
                )}
                
                {selectedCategory === "wins" && (
                  <>
                    <div className="w-24 text-right font-mono text-green-500">
                      {player.wins}
                    </div>
                    <div className="w-24 text-right font-mono text-red-500">
                      {player.losses}
                    </div>
                  </>
                )}
                
                <div className="w-24 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    player.rank === 'Diamond' ? 'bg-blue-500/20 text-blue-400' :
                    player.rank === 'Platinum' ? 'bg-teal-500/20 text-teal-400' :
                    player.rank === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    player.rank === 'Silver' ? 'bg-gray-400/20 text-gray-300' :
                    'bg-amber-600/20 text-amber-500'
                  }`}>
                    {player.rank}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Leaderboard;
