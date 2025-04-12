
import React from 'react';
import { Play, Trophy, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-20 flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern z-0"></div>
      <div className="absolute w-full h-full bg-gaming-darkest/50 z-0"></div>
      
      {/* Animated Circles */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-neon-purple/5 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-neon-blue/5 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white leading-tight">
              The Ultimate <span className="text-glow text-neon-purple">Gaming</span> Experience Awaits
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl">
              Dive into a world of high-quality games with stunning graphics, compete with players worldwide, and unlock exclusive rewards.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="btn-primary flex items-center">
                <Play size={18} className="mr-2" />
                Play Now
              </button>
              <button className="btn-outline">
                Explore Games
              </button>
            </div>
            
            <div className="flex flex-wrap gap-6 text-white/80">
              <div className="flex items-center">
                <Trophy className="text-neon-purple mr-2" size={20} />
                <span>Global Rankings</span>
              </div>
              <div className="flex items-center">
                <Users className="text-neon-blue mr-2" size={20} />
                <span>Multiplayer Lobbies</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative aspect-video rounded-lg overflow-hidden neon-border">
              <div className="absolute inset-0 bg-gaming-dark/70 z-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-neon-purple/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-neon-purple/30 transition-all duration-300">
                  <Play size={40} className="text-white ml-2" />
                </div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Featured Game" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Stats */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 glass-card rounded-lg py-4 px-6 shadow-lg grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">100+</p>
                <p className="text-xs text-white/70">Games</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-3xl font-bold text-white mb-1">20K+</p>
                <p className="text-xs text-white/70">Players</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">150+</p>
                <p className="text-xs text-white/70">Rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gaming-darkest to-transparent z-0"></div>
    </section>
  );
};

export default HeroSection;
