
import React from 'react';
import { User, LogIn, UserCircle, Trophy, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface UserProfileButtonProps {
  mobile?: boolean;
}

const UserProfileButton = ({ mobile = false }: UserProfileButtonProps) => {
  const { toast } = useToast();
  // Mock logged in state - in a real app, you'd check authentication
  const isLoggedIn = true;
  
  const handleLogin = () => {
    toast({
      title: "Authentication",
      description: "Login functionality requires Supabase integration.",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (isLoggedIn) {
    return (
      <div className="relative group">
        <button className={`flex items-center ${mobile ? 'p-1.5 text-white' : 'p-1 space-x-2 rounded-full bg-gaming-highlight border border-white/10 hover:bg-gaming-highlight/80 transition-colors'}`}>
          {mobile ? (
            <User size={20} />
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center text-white font-medium">
                NW
              </div>
              <span className="pr-3 text-sm font-medium">Profile</span>
            </>
          )}
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gaming-dark border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gaming-highlight transition-colors">
              <UserCircle size={16} />
              <span>My Profile</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gaming-highlight transition-colors">
              <Trophy size={16} />
              <span>Leaderboard</span>
            </Link>
            <Link to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gaming-highlight transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-gaming-highlight transition-colors"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className={`flex items-center justify-center ${mobile ? 'p-1.5 text-white' : 'p-1.5 bg-neon-purple text-white hover:bg-neon-purple/90 transition-colors rounded-md px-3'}`}
    >
      {mobile ? (
        <User size={20} />
      ) : (
        <>
          <LogIn size={18} className="mr-1" />
          <span>Login</span>
        </>
      )}
    </button>
  );
};

export default UserProfileButton;
