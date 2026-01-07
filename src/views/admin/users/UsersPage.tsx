import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Search, UserX, UserCheck } from 'lucide-react';
import { getUsers, updateUserStatus } from '../../../redux/actions/userActions';
import type { RootState } from '../../../redux/rootReducer';
import type { ThunkDispatch } from 'redux-thunk';
import type { UserActionTypes } from '../../../redux/types/userTypes';

import type { User } from '../../../redux/types/userTypes';
import UserDetailsModal from './UserDetailsModal';
import FilterSelect from '../../../components/common/FilterSelect';
import Pagination from '../../../components/common/Pagination';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'customer', label: 'Customer' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
];

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
            <h1 className="text-2xl font-bold text-text">User Management</h1>
            <p className="text-muted-text">
              Manage customers, managers, and admins.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Search
              </span>
              <div className="relative group">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-text group-hover:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-2xl text-sm font-semibold text-text placeholder:text-muted-text focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64 shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>
            </div>

            <FilterSelect
              label="Filter by Role"
              value={roleFilter || 'all'}
              options={ROLE_OPTIONS}
              onChange={(val) => {
                setRoleFilter(val === 'all' ? '' : val);
                setPage(1);
              }}
              className="w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    User
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-4 md:px-6 py-4 text-xs font-semibold text-muted-text uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-text"
                    >
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-rose-500"
                    >
                      Error: {error}
                      <br />
                      <button
                        onClick={() => window.location.reload()}
                        className="text-primary hover:underline text-sm mt-2 font-semibold"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-muted-text"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {user.name?.charAt(0) ||
                              user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-text truncate max-w-[120px] sm:max-w-none">
                              {user.name || 'Unknown'}
                            </p>
                            <p className="text-xs text-muted-text truncate max-w-[120px] sm:max-w-none">
                              {user.email}
                            </p>
                            {/* Mobile Only Role Badge */}
                            <div className="md:hidden mt-1">
                              <span
                                className={`
                                text-[10px] px-2 py-0.5 rounded-full font-medium border
                                ${
                                  user.role === 'admin'
                                    ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                    : user.role === 'manager'
                                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
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
                                          ? 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                          : user.role === 'manager'
                                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                      }
                                  `}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {user.isActive ? (
                          <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>{' '}
                            <span className="hidden sm:inline">Active</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-rose-500 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>{' '}
                            <span className="hidden sm:inline">Inactive</span>
                          </span>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-muted-text">
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
                              ? 'opacity-30 cursor-not-allowed bg-muted text-muted-text'
                              : user.isActive
                                ? 'hover:bg-rose-500/10 text-rose-500'
                                : 'hover:bg-emerald-500/10 text-emerald-500'
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
                          className="p-2 hover:bg-muted text-muted-text rounded-full transition-colors"
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
          {pagination && pagination.pages > 1 && (
            <div className="border-t border-border px-4 py-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={pagination.pages}
                onPageChange={setPage}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
