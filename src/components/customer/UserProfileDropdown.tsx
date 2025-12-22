import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  User,
  ShoppingBag,
  ChevronDown,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';
import { logout } from '../../redux/actions/authActions';
import type { RootState } from '../../redux/rootReducer';

const UserProfileDropdown: React.FC = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  // Get initials or first letter of name/email
  // Get initials or first letter of name/email
  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
          {initial}
        </div>
        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
          {displayName}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name || user.email?.split('@')[0] || 'User'}
            </p>
          </div>

          {user.role === 'admin' && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/admin');
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ShieldCheck size={16} />
              Admin Dashboard
            </button>
          )}
          {user.role === 'manager' && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/manager');
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Briefcase size={16} />
              Manager Dashboard
            </button>
          )}
          <div className="px-1">
            {user.role === 'customer' && (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/orders');
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <ShoppingBag size={16} />
                  My Orders
                </button>
              </>
            )}
          </div>

          <div className="border-t border-gray-100 mt-1 pt-1 px-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
