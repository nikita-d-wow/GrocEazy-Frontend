import { Search, ShoppingCart, Menu, Heart, ShoppingBag } from 'lucide-react';
import React, { useState } from 'react';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { logout } from '../../redux/actions/authActions';
import UserProfileDropdown from './UserProfileDropdown';
import { adminNav, managerNav, customerNav } from '../../utils/navitems';
import { selectCartItems } from '../../redux/selectors/cartSelectors';
import { selectWishlistItems } from '../../redux/selectors/wishlistSelectors';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get('search') || '';
  });
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // 1. Sync state FROM URL (Handles browser back/forward and external navigations)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search') || '';
    if (searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]); // Only re-run when actual URL search changes

  // 2. Sync URL FROM state (Handles typing with debounce)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentSearch = urlParams.get('search') || '';
    const trimmedQuery = searchQuery.trim();

    // Avoid redundant navigation if state matches URL
    if (trimmedQuery === currentSearch) {
      return;
    }

    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(location.search);
      if (trimmedQuery) {
        newParams.set('search', trimmedQuery);
        newParams.delete('category'); // Searching usually clears category
      } else {
        newParams.delete('search');
      }

      // Only navigate if we're not just clearing an empty search on a non-products page
      const isStillDifferent =
        newParams.get('search') !==
        (new URLSearchParams(location.search).get('search') || '');

      if (isStillDifferent) {
        navigate(`/products?${newParams.toString()}`, { replace: true });
        setOpen(false); // Close mobile menu
      }
    }, 700);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, navigate]); // Notice location.search is NOT a dependency to prevent feedback loops

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim();
      const params = new URLSearchParams(location.search);
      if (trimmed) {
        params.set('search', trimmed);
        params.delete('category');
      } else {
        params.delete('search');
      }
      navigate(`/products?${params.toString()}`, { replace: true });
      setOpen(false);
    }
  };

  const dispatch = useAppDispatch();

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
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-green-50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search available products..."
                className="w-64 pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-green-200 rounded-xl text-sm transition-all outline-none"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
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

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-2">
          {isCustomer && (
            <>
              <Link
                to="/wishlist"
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isActive('/wishlist')
                    ? 'bg-pink-50 text-pink-500'
                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
                }`}
              >
                <div className="relative">
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link
                to="/cart"
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  isActive('/cart')
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-500 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1 border border-white shadow-sm">
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
          <div className="relative mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-100"
            />
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          </div>

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
                  navigate('/profile');
                  setOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                    {user.name?.[0] || user.email?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name || 'User'}
                    </div>
                    <div className="text-xs text-green-600 font-medium tracking-tight">
                      View Profile
                    </div>
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
