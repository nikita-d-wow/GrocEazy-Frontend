import {
  Search,
  ShoppingCart,
  Menu,
  Heart,
  ShoppingBag,
  Bell,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';

import { logout } from '../../redux/actions/authActions';
import { setSearchQuery } from '../../redux/reducers/productReducer';
import {
  getUnreadCount,
  addNotification,
} from '../../redux/actions/chatActions';
import socketClient from '../../services/socket';
import UserProfileDropdown from './UserProfileDropdown';
import VoiceSearch from '../common/VoiceSearch';
import { adminNav, managerNav, customerNav } from '../../utils/navitems';
import { selectCartItems } from '../../redux/selectors/cartSelectors';
import {
  selectWishlistItems,
  selectWishlistPagination,
} from '../../redux/selectors/wishlistSelectors';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { searchQuery } = useSelector((state: RootState) => state.product);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistPagination = useSelector(selectWishlistPagination);
  const { unreadCount, notifications } = useSelector(
    (state: RootState) => state.chat
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const socket = socketClient.getSocket();

  useEffect(() => {
    if (user?.role === 'manager' || user?.role === 'admin') {
      dispatch(getUnreadCount() as any);

      const handleNewNotification = (data: any) => {
        dispatch(addNotification(data) as any);
      };

      const handleUnreadUpdate = () => {
        dispatch(getUnreadCount() as any);
      };

      socket.on('new_notification', handleNewNotification);
      socket.on('unread_count_update', handleUnreadUpdate);

      return () => {
        socket.off('new_notification', handleNewNotification);
        socket.off('unread_count_update', handleUnreadUpdate);
      };
    }
  }, [user, dispatch, socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistPagination?.total || wishlistItems.length;

  // No longer syncing search with URL query parameters

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!location.pathname.startsWith('/products')) {
        navigate('/products');
      }
      setOpen(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    dispatch(setSearchQuery(transcript));
    if (!location.pathname.startsWith('/products')) {
      navigate('/products');
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
    setOpen(false);
  };

  const role = user?.role || 'guest';
  const navItems =
    role === 'admin' ? adminNav : role === 'manager' ? managerNav : customerNav;

  const isCustomer = role === 'customer';
  const isLoggedIn = user && user.email;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    // For dashboard roots, we want to highlight only when on the actual dashboard home
    if (
      (path === '/manager' || path === '/admin') &&
      location.pathname !== path
    ) {
      return false;
    }

    // Support ticket paths should also highlight the Contact nav item
    if (
      path === '/contact' &&
      location.pathname.startsWith('/customer/tickets')
    ) {
      return true;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-green-50 fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
        {/* Logo - Link added with role-based navigation */}
        <Link
          to={
            role === 'admin' ? '/admin' : role === 'manager' ? '/manager' : '/'
          }
          className="flex items-center gap-2 group mr-8 cursor-pointer select-none"
        >
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
            Groc
            <span className="text-green-600">Eazy</span>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-green-600 bg-green-50 shadow-sm'
                  : 'hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          {/* Search */}
          {!['admin', 'manager'].includes(role) && (
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                onKeyDown={handleSearch}
                placeholder="Search available products..."
                className="w-64 pl-10 pr-12 py-2.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-200 rounded-xl text-sm transition-all outline-none"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <div className="absolute right-1.5 top-1">
                <VoiceSearch onTranscript={handleVoiceTranscript} />
              </div>
            </div>
          )}

          {/* Wishlist & Cart (CUSTOMER ONLY) */}
          {isCustomer && (
            <div className="flex items-center gap-2">
              <Link
                to="/wishlist"
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isActive('/wishlist')
                    ? 'bg-pink-50 text-pink-500 shadow-sm'
                    : 'hover:bg-pink-50 text-gray-500 hover:text-pink-500'
                }`}
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>

              <Link
                to="/cart"
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  isActive('/cart')
                    ? 'bg-green-50 text-green-600 shadow-sm'
                    : 'hover:bg-green-50 text-gray-500 hover:text-green-600'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* User Profile / Sign In */}
          <div className="flex items-center gap-1">
            {/* Notification Bell for Managers */}
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <div className="relative mr-2" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all relative group cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-800">
                        Interactions
                      </h3>
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        {unreadCount} Unread
                      </span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              navigate(`/manager/live-chat`);
                              setShowNotifications(false);
                            }}
                            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 flex gap-3"
                          >
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                              <Bell className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex justify-between items-start mb-0.5">
                                <p className="text-xs font-bold text-gray-900 truncate">
                                  Customer Message
                                </p>
                                <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap ml-2">
                                  {new Date(n.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-600 truncate">
                                {n.message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-gray-200" />
                          </div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Inbox Zero
                          </p>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/manager/live-chat"
                      onClick={() => setShowNotifications(false)}
                      className="block p-4 text-center text-xs font-bold text-green-600 hover:bg-green-100 transition-colors border-t border-gray-50 bg-green-50/30"
                    >
                      Open Live Chat
                    </Link>
                  </div>
                )}
              </div>
            )}

            {isLoggedIn ? (
              <UserProfileDropdown />
            ) : (
              <Link
                to="/login"
                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-2 flex-1 justify-end">
          {isCustomer && (
            <>
              {/* Mobile Search - Visible directly in header */}
              <div className="relative flex-1 max-w-[160px] xs:max-w-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  onKeyDown={handleSearch}
                  placeholder="Search..."
                  className="w-full pl-9 pr-10 py-2 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-200 rounded-xl text-xs transition-all outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                <div className="absolute right-1 top-0.5">
                  <VoiceSearch
                    onTranscript={handleVoiceTranscript}
                    className="!p-1.5"
                  />
                </div>
              </div>

              <Link
                to="/wishlist"
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isActive('/wishlist')
                    ? 'bg-pink-50 text-pink-500'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
                }`}
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link
                to="/cart"
                className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  isActive('/cart')
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </>
          )}
          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white border-t border-gray-100 shadow-xl space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-700 shadow-sm'
                    : 'hover:bg-green-50 text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {isLoggedIn ? (
            <div className="pt-4 border-t border-gray-100 space-y-1">
              {/* Mobile Profile Summary */}
              <div
                onClick={() => {
                  if (isCustomer) {
                    navigate('/profile');
                    setOpen(false);
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors ${isCustomer ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name || 'User'}
                    </div>
                    {isCustomer && (
                      <div className="text-xs text-green-600 font-medium tracking-tight">
                        View Profile
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isCustomer && (
                <div
                  onClick={() => {
                    navigate('/orders');
                    setOpen(false);
                  }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        My Orders
                      </div>
                      <div className="text-xs text-blue-600 font-medium tracking-tight">
                        Track & History
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 px-1 text-center">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors mt-2 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block w-full text-center bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
