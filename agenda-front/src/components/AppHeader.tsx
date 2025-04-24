import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Menu, X, User, LogOut } from "lucide-react";

import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import LogoutButton from './LogoutButton';

const AppHeader = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='bg-background border-b border-border sticky top-0 z-30'>
      <div className='px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        {/* Bouton de menu mobile */}
        <button
          className='md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-0'
          onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className='h-6 w-6' aria-hidden='true' />
          ) : (
            <Menu className='h-6 w-6' aria-hidden='true' />
          )}
        </button>

        {/* Barre de recherche */}
        <div className='flex-1 max-w-lg hidden md:block ml-8'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
            </div>
            <input
              type='text'
              placeholder='Rechercher...'
              className='block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-input placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center space-x-4'>
          <button className='p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0'>
            <span className='sr-only'>Voir les notifications</span>
            <Bell className='h-6 w-6' aria-hidden='true' />
          </button>

          <div className='ml-3 relative'>
            <button className='bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-0'>
              <span className='sr-only'>Ouvrir le menu utilisateur</span>
              <div className='h-8 w-8 rounded-full bg-agenda-light-purple flex items-center justify-center text-white'>
                <User className='h-5 w-5' aria-hidden='true' />
              </div>
            </button>
          </div>

          {/* Sélecteur de langue */}
          <div className="ml-2">
            <LanguageSelector />
          </div>
        {/* Bouton de déconnexion */}
        <div className="ml-2">
          <LogoutButton />
        </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className='md:hidden'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {/* Mobile menu items */}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default AppHeader;