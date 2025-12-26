import { UserRole } from '../constants/roles';

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: {
    canViewUsers: true,
    canManageInventory: true,
    canViewAllTickets: true,
    dashboardRoute: '/admin',
  },
  [UserRole.MANAGER]: {
    canViewUsers: false, // Managers cannot view unrestricted user list
    canManageInventory: true, // But only their own/assigned? Needs clarification. Assuming true for now.
    canViewAssignedTickets: true,
    dashboardRoute: '/manager',
  },
  [UserRole.CUSTOMER]: {
    canViewUsers: false,
    canManageInventory: false,
    canCreateOrders: true,
    dashboardRoute: '/',
  },
};

export const getRolePermissions = (role: string) => {
  // Graceful fallback for unknown roles
  return (
    ROLE_PERMISSIONS[role as UserRole] || {
      canViewUsers: false,
      canManageInventory: false,
      dashboardRoute: '/',
    }
  );
};
