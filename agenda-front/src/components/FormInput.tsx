import { InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: IconType;
}

const FormInput = ({ label, error, id, className, icon: Icon, ...props }: FormInputProps) => {
  return (
    <motion.div 
      className="form-control mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={id} className="form-label text-base mb-2 text-gray-700 font-medium">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Icon size={20} />
          </div>
        )}
        <input
          id={id}
          className={`form-input ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'} ${className} bg-white w-full shadow-sm hover:border-primary-400 rounded-xl`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          className="mt-2 text-sm text-red-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormInput;