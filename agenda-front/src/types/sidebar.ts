// Types centralisés pour Sidebar et ses sous-composants
import type { Icon } from 'lucide-react';

export interface SidebarNavItem {
  name: string;
  path: string;
  icon: typeof Icon;
}

export interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}
