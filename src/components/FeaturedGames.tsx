
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import GameCard, { GameCardProps } from './GameCard';
import CategoryFilter from './CategoryFilter';

// Sample data
const featuredGames: GameCardProps[] = [
  {
    id: 1,
    title: "Cybernetic Assault",
    category: "Action",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    rating: 4.8,
    players: "20k+",
    featured: true
  },
  {
    id: 2,
    title: "Neon Racer X",
    category: "Racing",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    rating: 4.6,
    players: "15k+",
    featured: true
  },
  {
    id: 3,
    title: "Galaxy Conquest",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1614294149013-6b284299b59d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.9,
    players: "18k+",
    featured: true
  },
  {
    id: 4,
    title: "Mystic Legends",
    category: "RPG",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    rating: 4.7,
    players: "12k+",
    featured: true
  }
];

const allGames: GameCardProps[] = [
  ...featuredGames,
  {
    id: 5,
    title: "Space Warriors",
    category: "Action",
    image: "https://images.unsplash.com/photo-1496347646636-ea47f7d6b37b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.3,
    players: "8k+",
  },
  {
    id: 6,
    title: "Stealth Ninja",
    category: "Action",
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.5,
    players: "10k+",
  },
  {
    id: 7,
    title: "Drift King",
    category: "Racing",
    image: "https://images.unsplash.com/photo-1591631367588-1628c879f148?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.2,
    players: "7k+",
  },
  {
    id: 8,
    title: "City Builder Pro",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1774&q=80",
    rating: 4.4,
    players: "5k+",
  },
  {
    id: 9,
    title: "Dragon Quest",
    category: "RPG",
    image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8431cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.6,
    players: "9k+",
  },
  {
    id: 10,
    title: "Cooking Master",
    category: "Casual",
    image: "https://images.unsplash.com/photo-1528644198735-c5a229a9541b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.1,
    players: "6k+",
  },
  {
    id: 11,
    title: "Puzzle Box",
    category: "Casual",
    image: "https://images.unsplash.com/photo-1614589118554-3b56b93aaedb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1773&q=80",
    rating: 4.0,
    players: "4k+",
  },
  {
    id: 12,
    title: "War Machines",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1569017388730-020b5f80a004?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    rating: 4.7,
    players: "11k+",
  }
];

const FeaturedGames = () => {
  const categories = ["All", "Action", "Racing", "Strategy", "RPG", "Casual"];
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredGames = activeCategory === "All" 
    ? allGames 
    : allGames.filter(game => game.category === activeCategory);
  
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
