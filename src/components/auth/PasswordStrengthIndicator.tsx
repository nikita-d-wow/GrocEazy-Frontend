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
    <div className="mt-2 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <p className="text-xs font-medium text-gray-500 mb-2">
        Password Requirements:
      </p>
      {checks.map((check, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-xs transition-colors duration-200"
        >
          {check.valid ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <X size={14} className="text-gray-400" />
          )}
          <span
            className={
              check.valid ? 'text-green-700 font-medium' : 'text-gray-500'
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
