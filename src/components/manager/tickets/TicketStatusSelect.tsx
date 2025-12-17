import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import type { TicketStatus } from '../../../redux/types/support.types';

interface Props {
  status: TicketStatus;
  disabled: boolean;
  onChange: (_status: TicketStatus) => void;
}

const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  open: {
    label: 'Open',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    dot: 'bg-blue-500',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    dot: 'bg-amber-500',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  closed: {
    label: 'Closed',
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    dot: 'bg-gray-500',
  },
};

export default function TicketStatusSelect({
  status,
  disabled,
  onChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 pl-3 pr-2 py-1.5
          rounded-xl border transition-all duration-200
          ${currentConfig.bg} ${currentConfig.color}
          ${
            isOpen
              ? 'ring-2 ring-violet-500/20 border-violet-200'
              : 'border-transparent hover:border-gray-200'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <div className={`w-2 h-2 rounded-full ${currentConfig.dot}`} />
        <span className="text-sm font-semibold">{currentConfig.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="
              absolute right-0 top-full mt-2 z-50
              w-44 p-1
              bg-white/80 backdrop-blur-xl
              border border-white/50
              rounded-2xl shadow-xl
              flex flex-col gap-0.5
            "
          >
            {(Object.keys(STATUS_CONFIG) as TicketStatus[]).map((key) => {
              const config = STATUS_CONFIG[key];
              const isSelected = status === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    onChange(key);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between
                    px-3 py-2 rounded-xl text-sm transition-colors
                    ${
                      isSelected
                        ? 'bg-violet-50 text-violet-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${config.dot} ${
                        !isSelected && 'opacity-50'
                      }`}
                    />
                    {config.label}
                  </div>
                  {isSelected && <Check size={14} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
