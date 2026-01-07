import React from 'react';
import { PATTERNS } from '../../utils/validationSchemas';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  if (!password) {
    return null;
  }

  const checks = [
    {
      label: `At least ${PATTERNS.minLength} characters`,
      valid: password.length >= PATTERNS.minLength,
    },
    {
      label: 'One uppercase letter',
      valid: PATTERNS.uppercase.test(password),
    },
    {
      label: 'One lowercase letter',
      valid: PATTERNS.lowercase.test(password),
    },
    {
      label: 'One number',
      valid: PATTERNS.number.test(password),
    },
    {
      label: 'One special character',
      valid: PATTERNS.special.test(password),
    },
  ];

  const allValid = checks.every((check) => check.valid);

  if (allValid) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1 bg-muted p-3 rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-300">
      <p className="text-xs font-medium text-muted-text mb-2">
        Password Requirements:
      </p>
      {checks.map((check, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-xs transition-colors duration-200"
        >
          {check.valid ? (
            <Check size={14} className="text-emerald-500" />
          ) : (
            <X size={14} className="text-muted-text/50" />
          )}
          <span
            className={
              check.valid
                ? 'text-emerald-600 dark:text-emerald-500 font-medium'
                : 'text-muted-text'
            }
          >
            {check.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthIndicator;
