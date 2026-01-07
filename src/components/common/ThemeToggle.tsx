import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-text transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group overflow-hidden relative"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`w-5 h-5 transition-all duration-500 absolute inset-0 ${
            theme === 'dark'
              ? 'translate-y-10 rotate-90 opacity-0'
              : 'translate-y-0 rotate-0 opacity-100'
          }`}
        />
        <Moon
          className={`w-5 h-5 transition-all duration-500 absolute inset-0 ${
            theme === 'light'
              ? '-translate-y-10 -rotate-90 opacity-0'
              : 'translate-y-0 rotate-0 opacity-100'
          }`}
        />
      </div>

      {/* Subtle background glow effect on hover */}
      <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
