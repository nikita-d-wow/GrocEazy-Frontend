import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  highlightText?: string;
  subtitle: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlightText,
  subtitle,
  icon: Icon,
  children,
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
    <div className="relative rounded-3xl bg-green-50/50 p-6 md:p-10 mb-10 overflow-hidden border border-green-100/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {Icon && <Icon className="w-8 h-8 text-green-700" />}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              {titleContent}
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-lg">{subtitle}</p>
        </div>

        {children && <div className="w-full md:w-auto">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
