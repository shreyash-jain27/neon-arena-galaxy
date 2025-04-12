
import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';
import UserProfileButton from './UserProfileButton';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gaming-darker/90 backdrop-blur-md py-3 shadow-md' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-neon-glow mr-1">NEON</span>
            <span className="text-2xl font-bold text-white">ARENA</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <a href="#games" className="nav-link">Games</a>
          <a href="#leaderboards" className="nav-link">Leaderboards</a>
          <a href="#community" className="nav-link">Community</a>
          <a href="#rewards" className="nav-link">Rewards</a>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-white/70 hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <UserProfileButton />
          <button className="btn-primary">Play Now</button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <UserProfileButton mobile />
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-2 text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-gaming-darker/95 backdrop-blur-md transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-screen py-4 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <a href="#games" className="nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Games</a>
          <a href="#leaderboards" className="nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Leaderboards</a>
          <a href="#community" className="nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Community</a>
          <a href="#rewards" className="nav-link text-lg" onClick={() => setMobileMenuOpen(false)}>Rewards</a>
          <div className="flex items-center space-x-2 pt-2">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
          </div>
          <button className="btn-primary w-full">Play Now</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
