import type { FC, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input: FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          onWheel={(e) => {
            if (props.type === 'number') {
              (e.target as HTMLInputElement).blur();
            }
          }}
          className={`
            w-full bg-white text-gray-900 border-2 rounded-xl 
            ${leftIcon ? 'pl-10' : 'pl-4'} 
            ${rightIcon ? 'pr-10' : 'pr-4'} 
            py-2.5 outline-none transition-all duration-200
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50'
            }
            ${className}
            placeholder:text-gray-400
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
