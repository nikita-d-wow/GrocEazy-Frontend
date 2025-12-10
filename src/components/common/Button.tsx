import type { FC, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200 focus:ring-green-500 border border-transparent',
    secondary:
      'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200 focus:ring-orange-500 border border-transparent',
    outline:
      'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-500 hover:text-green-600 hover:bg-green-50 focus:ring-green-500',
    danger:
      'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200 focus:ring-red-500 border border-transparent',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm space-x-1.5',
    md: 'px-6 py-2.5 text-base space-x-2',
    lg: 'px-8 py-3.5 text-lg space-x-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};

export default Button;
