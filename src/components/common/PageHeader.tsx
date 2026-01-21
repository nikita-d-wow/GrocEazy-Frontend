import * as React from 'react';
import { type LucideIcon, ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  highlightText?: string;
  subtitle: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlightText,
  subtitle,
  icon: Icon,
  children,
  onBack,
}) => {
  // Construct title with optional highlight
  const titleContent = highlightText ? (
    <>
      <span className="text-green-700">{highlightText}</span>
      {title.replace(highlightText, '')}
    </>
  ) : (
    title
  );

  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-green-50/50 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8 md:mb-10 border border-green-100/50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-200/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 -z-10" />

      <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            {onBack && (
              <button
                onClick={onBack}
                className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/60 hover:bg-white border border-green-100 text-green-800 hover:text-green-700 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                aria-label="Go back"
              >
                <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
            )}
            {Icon && (
              <Icon className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-700" />
            )}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight break-words">
              {titleContent}
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 max-w-full md:max-w-2xl lg:max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {children && (
          <div className="w-full md:w-auto flex-shrink-0 mt-2 md:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
