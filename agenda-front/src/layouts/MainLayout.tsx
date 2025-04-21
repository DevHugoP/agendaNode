import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader';
import { useSidebarStore } from '../store/sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isSidebarCollapsed = useSidebarStore((state) => state.isCollapsed);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <AppHeader />
        
        <motion.main 
          className={`flex-1 relative overflow-y-auto focus:outline-none bg-background ${isSidebarCollapsed ? 'p-1 md:p-2' : 'p-4 md:p-6'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;