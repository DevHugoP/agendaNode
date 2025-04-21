import { Link, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../store/sidebar';
import { motion } from 'framer-motion';
import SidebarTooltip from './SidebarTooltip';
import { 
  Calendar, 
  Home, 
  MessageSquare, 
  CreditCard,
  Users,
  User,
  Settings,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  LogOut 
} from 'lucide-react';

import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isCollapsed, setCollapsed } = useSidebarStore();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: Home },
    { name: t('sidebar.calendar'), path: '/calendar', icon: Calendar },
    { name: t('sidebar.clients'), path: '/clients', icon: Users },
    { name: t('sidebar.smsHistory'), path: '/sms', icon: MessageSquare },
    { name: t('sidebar.vouchers'), path: '/vouchers', icon: CreditCard },
  ];

  const secondaryNavItems = [
    { name: t('sidebar.profile'), path: '/profile', icon: User },
    { name: t('sidebar.settings'), path: '/settings', icon: Settings },
    { name: t('sidebar.help'), path: '/help', icon: HelpCircle },
  ];

  const toggleSidebar = () => {
    setCollapsed(!isCollapsed);
  };

  return (
    <>
      <motion.aside
        className="bg-sidebar-background text-sidebar-foreground h-screen flex-shrink-0 relative"
        animate={{ width: isCollapsed ? '64px' : '240px' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between h-16 px-4">
          <div className={`font-bold text-xl ${isCollapsed ? 'hidden' : 'block'}`}>
            {t('sidebar.brand')}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-agenda-dark-purple transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => {
  const Icon = item.icon;
  const active = isActive(item.path);

  return isCollapsed ? (
    <SidebarTooltip label={item.name} key={item.path}>
      <Link
        to={item.path}
        className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
          active
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <Icon size={20} className={`${active ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`} />
      </Link>
    </SidebarTooltip>
  ) : (
    <Link
      key={item.path}
      to={item.path}
      className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
    >
      <Icon size={20} className={`${active ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`} />
      <span className="ml-3 truncate">{item.name}</span>
    </Link>
  );
})}
          </div>

          <div className="space-y-1 mt-8 pt-6 border-t border-white/10">
            {secondaryNavItems.map((item) => {
  const Icon = item.icon;
  const active = isActive(item.path);

  return isCollapsed ? (
    <SidebarTooltip label={item.name} key={item.path}>
      <Link
        to={item.path}
        className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
          active
            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <Icon size={20} className={`${active ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`} />
      </Link>
    </SidebarTooltip>
  ) : (
    <Link
      key={item.path}
      to={item.path}
      className={`flex items-center px-3 py-3 text-sm rounded-md transition-colors ${
        active
          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
    >
      <Icon size={20} className={`${active ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/70'}`} />
      <span className="ml-3 truncate">{item.name}</span>
    </Link>
  );
})}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => {
              setToken(null);
              localStorage.removeItem('token');
              navigate('/login');
            }}
            className="flex items-center w-full px-3 py-3 text-sm rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            type="button"
          >
            {isCollapsed ? (
              <SidebarTooltip label={t('sidebar.logout')}>
                <LogOut size={20} />
              </SidebarTooltip>
            ) : (
              <>
                <LogOut size={20} />
                <span className="ml-3">{t('sidebar.logout')}</span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;