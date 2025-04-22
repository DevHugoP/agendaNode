import React from 'react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  children: ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    isLoading = false, 
    children, 
    className = '', 
    ...props 
  }, ref) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  
  return (
    <motion.button
      ref={ref}
      className={`${baseClass} ${variantClass} ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''} py-3 font-semibold rounded-xl text-base`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Chargement...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

export default Button;