
import React from 'react';
import { User } from 'lucide-react';

interface UserProfileButtonProps {
  mobile?: boolean;
}

const UserProfileButton = ({ mobile = false }: UserProfileButtonProps) => {
  // In a real app, you'd check if the user is logged in
  const isLoggedIn = false;

  if (isLoggedIn) {
    return (
      <button className={`flex items-center ${mobile ? 'p-1.5 text-white' : 'p-1 space-x-2 rounded-full bg-gaming-highlight border border-white/10 hover:bg-gaming-highlight/80 transition-colors'}`}>
        {mobile ? (
          <User size={20} />
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-neon-purple flex items-center justify-center text-white font-medium">
              JD
            </div>
            <span className="pr-3 text-sm font-medium">Profile</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button className={`flex items-center justify-center ${mobile ? 'p-1.5 text-white' : 'p-1.5 text-white hover:text-neon-purple transition-colors'}`}>
      <User size={mobile ? 20 : 22} />
    </button>
  );
};

export default UserProfileButton;
