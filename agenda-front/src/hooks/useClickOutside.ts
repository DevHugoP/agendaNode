import { useEffect } from 'react';

export function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: (event: MouseEvent) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function listener(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    }
    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler, enabled]);
}
