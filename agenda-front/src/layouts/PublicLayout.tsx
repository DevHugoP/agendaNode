import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.header 
        className="bg-agenda-purple text-white py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            agenda.ch
          </Link>
          <div className="space-x-4">
            <Link to="/register" className="text-white hover:text-gray-200">
              S'inscrire
            </Link>
            <Link
              to="/login"
              className="bg-white text-agenda-purple py-2 px-4 rounded hover:bg-gray-100 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </motion.header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <motion.footer 
        className="bg-gray-100 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-600">&copy; 2025 Agenda.ch - Tous droits réservés</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                Aide
              </a>
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                Conditions
              </a>
              <a href="#" className="text-gray-600 hover:text-agenda-purple">
                Confidentialité
              </a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default PublicLayout;