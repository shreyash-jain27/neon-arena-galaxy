
import React from 'react';
import { Github, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gaming-darker">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center mb-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-glow mr-1">NEON</span>
              <span className="text-2xl font-bold text-white">ARENA</span>
            </a>
            <p className="text-white/70 mb-6 max-w-md">
              The ultimate gaming destination with high-quality games, competitive gameplay, and a vibrant community of gamers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/50 hover:text-neon-purple transition-colors"><Github size={20} /></a>
              <a href="#" className="text-white/50 hover:text-neon-purple transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-white/50 hover:text-neon-purple transition-colors"><Youtube size={20} /></a>
              <a href="#" className="text-white/50 hover:text-neon-purple transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-white/50 hover:text-neon-purple transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Games</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Leaderboards</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Rewards</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Live Streams</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 Neon Arena. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/50 hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-white/50 hover:text-white text-sm">Terms</a>
            <a href="#" className="text-white/50 hover:text-white text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
