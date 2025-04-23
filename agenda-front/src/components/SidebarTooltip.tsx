import { ReactNode, useRef, useState } from 'react';

import type { SidebarTooltipProps } from '../types/SidebarTooltip';

export const SidebarTooltip = ({ label, children, delay = 300 }: SidebarTooltipProps): JSX.Element => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50 px-3 py-1.5 rounded bg-black/80 text-white text-sm whitespace-nowrap shadow-lg border border-white/10 animate-fade-in">
          {label}
        </div>
      )}
    </div>
  );
};

export default SidebarTooltip;
