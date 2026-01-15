import * as React from 'react';
import { type LucideIcon, ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string | React.ReactNode;
  highlightText?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlightText,
  subtitle,
  icon: Icon,
  actions,
  children,
  onBack,
}) => {
  // Construct title with optional highlight (only if title is string)
  const titleContent =
    typeof title === 'string' && highlightText ? (
      <>
        <span className="text-green-700">{highlightText}</span>
        {title.replace(highlightText, '')}
      </>
    ) : (
      title
    );

  return (
    <div className="relative rounded-2xl sm:rounded-3xl bg-green-50/50 p-4 sm:p-6 md:p-10 mb-6 sm:mb-10 border border-green-100/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 -z-10" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-2 p-2 rounded-xl bg-white/60 hover:bg-white border border-green-100 text-green-800 hover:text-green-700 transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                aria-label="Go back"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {Icon && <Icon className="w-8 h-8 text-green-700" />}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {titleContent}
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-lg max-w-lg">
            {subtitle}
          </p>
        </div>

        {(actions || children) && (
          <div className="w-full md:w-auto">{actions || children}</div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
