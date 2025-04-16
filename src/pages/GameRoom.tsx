
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { games, chatMessages } from "../services/mockData";
import { MessageSquare, Users, Trophy, ArrowLeft, Send, XCircle, Volume2, Volume1, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import game components
import CyberneticAssault from "../games/CyberneticAssault";
import NeonRacerX from "../games/NeonRacerX";
import GalaxyConquest from "../games/GalaxyConquest";
import MysticLegends from "../games/MysticLegends";

const GameRoom = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState(chatMessages);
  const [volume, setVolume] = useState<number>(2); // 0=mute, 1=low, 2=full
  const { toast } = useToast();
  
  useEffect(() => {
    // Find the game from our mock data
    const foundGame = games.find(g => g.id === id);
    if (foundGame) {
      setGame(foundGame);
    }
    
    // Notify the user that the game has loaded
    setTimeout(() => {
      toast({
        title: "Game Loaded",
        description: "You've earned 50 XP for playing a game today!",
      });
    }, 2000);
  }, [id, toast]);
  
  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        sender: "You",
        text: message,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  const cycleVolume = () => {
    setVolume((volume + 1) % 3);
  };

  // Render the appropriate game component
  const renderGame = () => {
    if (!game) return null;

    switch (game.id) {
      case "cybernetic-assault":
        return <CyberneticAssault />;
      case "neon-racer-x":
        return <NeonRacerX />;
      case "galaxy-conquest":
        return <GalaxyConquest />;
      case "mystic-legends":
        return <MysticLegends />;
      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-2xl font-bold mb-4">{game.name}</h2>
              <p className="text-white/70 mb-6">{game.description}</p>
              <div className="bg-gaming-highlight p-4 rounded-lg inline-block">
                <p className="text-neon-purple mb-2">Game coming soon!</p>
                <p className="text-white/60 text-sm">This game is currently in development</p>
              </div>
            </div>
          </div>
        );
    }
  };
  
  if (!game) {
    return (
      <div className="min-h-screen bg-gaming-darkest text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="glass-card p-8 rounded-lg max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
            <p className="text-white/70 mb-6">Sorry, we couldn't find the game you're looking for.</p>
            <Link to="/" className="btn-primary inline-block">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gaming-darkest text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="p-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">{game.name}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={cycleVolume}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              {volume === 0 && <VolumeX size={20} />}
              {volume === 1 && <Volume1 size={20} />}
              {volume === 2 && <Volume2 size={20} />}
            </button>
            
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded-md transition-colors ${
                chatOpen ? 'bg-neon-purple text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex h-[calc(100vh-220px)] gap-4">
          <div className={`glass-card rounded-lg flex-grow overflow-hidden ${chatOpen ? 'w-3/4' : 'w-full'}`}>
            {renderGame()}
          </div>
          
          {chatOpen && (
            <div className="glass-card rounded-lg w-1/4 flex flex-col">
              <div className="p-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <MessageSquare size={16} />
                  Game Chat
                </h3>
                <button 
                  onClick={() => setChatOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <XCircle size={18} />
                </button>
              </div>
              
              <div className="flex-grow p-3 overflow-y-auto space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`rounded-lg p-2 ${
                    msg.sender === "You" 
                      ? 'bg-neon-purple/20 ml-4' 
                      : 'bg-gaming-highlight/50 mr-4'
                  }`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-medium text-sm ${
                        msg.sender === "You" ? 'text-neon-purple' : 'text-white'
                      }`}>
                        {msg.sender}
                      </span>
                      <span className="text-white/40 text-xs">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-grow bg-gaming-dark p-2 rounded-md text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-purple"
                />
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-neon-purple text-white rounded-md"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="glass-card p-4 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-medium">Leaderboard</h3>
              <p className="text-sm text-white/60">Current #1: NeonWarrior</p>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-medium">Online Players</h3>
              <p className="text-sm text-white/60">48 players online now</p>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 className="font-medium">Matchmaking</h3>
              <p className="text-sm text-white/60">12 players seeking matches</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GameRoom;
