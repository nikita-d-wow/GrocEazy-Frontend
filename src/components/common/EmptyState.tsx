import type { FC, ReactNode } from 'react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-muted rounded-3xl border border-dashed border-border">
      {icon && <div className="mb-4 text-muted-text opacity-40">{icon}</div>}

      <h3 className="text-xl font-bold text-text mb-2">{title}</h3>

      <p className="text-muted-text max-w-sm">{description}</p>

      {action && (
        <div className="mt-6">
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
