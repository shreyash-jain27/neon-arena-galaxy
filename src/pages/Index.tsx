
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedGames from '../components/FeaturedGames';
import Footer from '../components/Footer';
import { Trophy, Users, Gamepad, Gift } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gaming-darkest text-white">
      <Navbar />
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center mb-4">
                <Trophy className="text-neon-purple" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Leaderboards</h3>
              <p className="text-white/70">Compete with players worldwide and climb to the top of the global rankings.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mb-4">
                <Users className="text-neon-blue" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiplayer</h3>
              <p className="text-white/70">Join forces with friends or challenge opponents in thrilling multiplayer battles.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-neon-pink/10 flex items-center justify-center mb-4">
                <Gamepad className="text-neon-pink" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">High-Quality Games</h3>
              <p className="text-white/70">Experience stunning graphics and immersive gameplay across all devices.</p>
            </div>
            
            <div className="glass-card p-6 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center mb-4">
                <Gift className="text-neon-green" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Rewards System</h3>
              <p className="text-white/70">Earn XP, unlock achievements, and claim exclusive in-game rewards.</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedGames />
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Arena?</h2>
            <p className="text-white/80 mb-8 text-lg">
              Create your account now and start your gaming journey. Compete with players worldwide, earn rewards, and become a legend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">Create Account</button>
              <button className="btn-outline">Learn More</button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
