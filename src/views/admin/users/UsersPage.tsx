import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Search, SlidersHorizontal, UserX, UserCheck } from 'lucide-react';
import { getUsers, updateUserStatus } from '../../../redux/actions/userActions';
import type { RootState } from '../../../redux/rootReducer';
import type { ThunkDispatch } from 'redux-thunk';
import type { UserActionTypes } from '../../../redux/types/userTypes';

import type { User } from '../../../redux/types/userTypes';
import UserDetailsModal from './UserDetailsModal';

export default function UsersPage() {
  const dispatch =
    useDispatch<ThunkDispatch<RootState, undefined, UserActionTypes>>();
  const { users, pagination, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSearch, setSubmittedSearch] = useState('');

  useEffect(() => {
    dispatch(getUsers(page, roleFilter, submittedSearch));
  }, [dispatch, page, roleFilter, submittedSearch]);

  // Debounce search query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      setSubmittedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    if (
      window.confirm(
        `Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`
      )
    ) {
      dispatch(updateUserStatus(userId, { isActive: !currentStatus }));
    }
  };

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // if (error) {
  //     console.error(error);
  // }

  return (
    <>
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 py-10 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-500">
              Manage customers, managers, and admins.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-2 border px-3 py-2 rounded-lg bg-white">
              <SlidersHorizontal size={16} className="text-gray-500" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-sm font-medium outline-none text-gray-700"
              >
                <option value="">All Roles</option>
                <option value="customer">Customer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-red-500"
                    >
                      Error: {error}
                      <br />
                      <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 underline text-sm mt-2"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                            {user.name?.charAt(0) ||
                              user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                              {user.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">
                              {user.email}
                            </p>
                            {/* Mobile Only Role Badge */}
                            <div className="md:hidden mt-1">
                              <span
                                className={`
                                text-[10px] px-2 py-0.5 rounded-full font-medium border
                                ${
                                  user.role === 'admin'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : user.role === 'manager'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-green-50 text-green-700 border-green-200'
                                }
                            `}
                              >
                                {user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span
                          className={`
                                      px-2.5 py-1 rounded-full text-xs font-semibold border
                                      ${
                                        user.role === 'admin'
                                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                                          : user.role === 'manager'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : 'bg-green-50 text-green-700 border-green-200'
                                      }
                                  `}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {user.isActive ? (
                          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>{' '}
                            <span className="hidden sm:inline">Active</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>{' '}
                            <span className="hidden sm:inline">Inactive</span>
                          </span>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-right flex items-center justify-end gap-2">
                        {/* Actions Buttons */}
                        <button
                          disabled={user.role === 'admin'}
                          onClick={() =>
                            handleStatusToggle(user._id, user.isActive)
                          }
                          className={`
                          p-2 rounded-full transition-colors 
                          ${
                            user.role === 'admin'
                              ? 'opacity-30 cursor-not-allowed bg-gray-100 text-gray-400'
                              : user.isActive
                                ? 'hover:bg-red-50 text-red-600'
                                : 'hover:bg-green-50 text-green-600'
                          }
                        `}
                          title={
                            user.role === 'admin'
                              ? 'Cannot deactivate admin'
                              : user.isActive
                                ? 'Deactivate'
                                : 'Activate'
                          }
                        >
                          {user.isActive ? (
                            <UserX size={18} />
                          ) : (
                            <UserCheck size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => openModal(user)}
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-full transition-colors"
                          title="View User Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
