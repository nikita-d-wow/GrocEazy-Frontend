import React from 'react';

interface StatusBadgeProps {
  isActive?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isActive
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-red-100 text-red-800 border-red-200'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

export default StatusBadge;
