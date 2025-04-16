
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Users, Award } from 'lucide-react';

export interface GameCardProps {
  id: number;
  title: string;
  category: string;
  image: string;
  rating: number;
  players: string;
  featured?: boolean;
}

const GameCard = ({ id, title, category, image, rating, players, featured = false }: GameCardProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div 
      className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${featured ? 'aspect-video' : 'aspect-[3/4]'} glass-card`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 game-card-overlay flex flex-col justify-end p-4">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-2 py-1 bg-gaming-darker/80 backdrop-blur-sm rounded text-xs font-medium text-white/90">
          {category}
        </div>
        
        {/* Play Button (shows on hover) */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <Link to={`/game/${id}`}>
            <button className="w-14 h-14 rounded-full bg-neon-purple/80 hover:bg-neon-purple text-white flex items-center justify-center shadow-lg">
              <Play size={24} className="ml-1" />
            </button>
          </Link>
        </div>
        
        {/* Game Info */}
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-neon-orange fill-neon-orange" />
            <span className="text-sm text-white/90">{rating}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Users size={14} className="text-white/70" />
            <span className="text-xs text-white/70">{players}</span>
          </div>
        </div>
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 px-2 py-1 bg-neon-purple/80 backdrop-blur-sm rounded flex items-center">
            <Award size={14} className="text-white mr-1" />
            <span className="text-xs font-bold text-white">FEATURED</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
