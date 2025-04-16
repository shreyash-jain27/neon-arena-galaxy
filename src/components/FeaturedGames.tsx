
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import GameCard from './GameCard';
import CategoryFilter from './CategoryFilter';
import { games as mockGames } from '../services/mockData';

const FeaturedGames = () => {
  const categories = ["All Games", "Action", "Racing", "Strategy", "RPG", "Casual"];
  const [activeCategory, setActiveCategory] = useState("All Games");
  
  // Convert mock games to the format needed by GameCard
  const transformedGames = mockGames.map(game => ({
    id: game.id,
    title: game.name,
    category: game.category,
    image: game.thumbnail,
    rating: game.rating,
    players: game.players,
  }));
  
  // Featured games are the first 4
  const featuredGames = transformedGames.slice(0, 4).map(game => ({
    ...game,
    featured: true
  }));
  
  // Filter games based on selected category
  const filteredGames = activeCategory === "All Games" 
    ? transformedGames 
    : transformedGames.filter(game => game.category === activeCategory);
  
  return (
    <section id="games" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Featured Games</h2>
            <p className="text-white/70 max-w-2xl">Explore our handpicked selection of the most exciting games with stunning graphics and immersive gameplay.</p>
          </div>
          
          <a href="#" className="text-neon-purple hover:text-neon-purple/80 flex items-center mt-4 md:mt-0">
            View All Games <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
        
        {/* Featured Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredGames.map(game => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-8">Explore Games</h2>
        
        {/* Categories */}
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        {/* All Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {filteredGames.map(game => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
