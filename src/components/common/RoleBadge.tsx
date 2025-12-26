import React from 'react';
import { UserRole } from '../../constants/roles';

interface RoleBadgeProps {
  role: string;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeStyle = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-red-100 text-red-800 border-red-200';
      case UserRole.MANAGER:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case UserRole.CUSTOMER:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        role
      )}`}
    >
      {formatRole(role)}
    </span>
  );
};

export default RoleBadge;
