import { motion, AnimatePresence } from 'framer-motion';

import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Toast({ show, message, type = 'success' }: { show: boolean; message: string; type?: 'success' | 'error' }) {
  const base = 'fixed top-6 right-6 z-50 min-w-[260px] max-w-[350px] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white font-semibold text-base';
  const color = type === 'success'
    ? 'bg-[#22c55e]'
    : 'bg-[#ef4444]';
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={`${base} ${color}`}
        >
          {type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
          )}
          <span className="text-center w-full">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

