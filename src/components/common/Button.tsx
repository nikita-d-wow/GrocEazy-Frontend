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
    'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-r from-green-300 to-emerald-300 hover:from-green-400 hover:to-emerald-400 text-gray-900 shadow-sm focus:ring-green-400 border border-transparent',
    secondary:
      'bg-gradient-to-r from-amber-300 to-yellow-300 hover:from-amber-400 hover:to-yellow-400 text-gray-900 shadow-sm focus:ring-amber-400 border border-transparent',
    outline:
      'bg-card text-text border-2 border-border hover:border-primary/30 hover:text-primary hover:bg-primary-light focus:ring-primary-light',
    danger:
      'bg-gradient-to-r from-red-300 to-rose-300 hover:from-red-400 hover:to-rose-400 text-gray-900 shadow-sm focus:ring-red-400 border border-transparent',
    ghost:
      'bg-transparent text-muted-text hover:bg-muted hover:text-text focus:ring-border',
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
