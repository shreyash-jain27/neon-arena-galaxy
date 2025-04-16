
import React from 'react';
import { Gamepad, Zap, Trophy, Users, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: CategoryFilterProps) => {
  // Get the corresponding icon for each category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'all games':
        return <Gamepad size={16} />;
      case 'action':
        return <Zap size={16} />;
      case 'competitive':
        return <Trophy size={16} />;
      case 'multiplayer':
        return <Users size={16} />;
      case 'new releases':
        return <Sparkles size={16} />;
      default:
        return <Gamepad size={16} />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            activeCategory === category
              ? 'bg-neon-purple text-white shadow-neon'
              : 'bg-gaming-dark hover:bg-gaming-highlight text-white/70 hover:text-white'
          }`}
        >
          {getCategoryIcon(category)}
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
