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
          className="block text-sm font-medium text-gray-700 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <textarea
          id={inputId}
          className={`
            w-full bg-white text-gray-900 border-2 rounded-xl 
            px-4 py-2.5 outline-none transition-all duration-200
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                : 'border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-50'
            }
            placeholder:text-gray-400
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs ml-1 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
