import type { FC, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea: FC<TextAreaProps> = ({
  label,
  error,
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
          className="block text-sm font-medium text-text ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <textarea
          id={inputId}
          className={`
            w-full bg-card text-text border-2 rounded-xl 
            px-4 py-2.5 outline-none transition-all duration-200
            ${
              error
                ? 'border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                : 'border-border hover:border-muted-text/30 focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
            placeholder:text-muted-text/50
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-rose-500 text-xs ml-1 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
