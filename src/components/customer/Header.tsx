import { Search, ShoppingCart, Menu, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '../../redux/rootReducer';
import UserProfileDropdown from './UserProfileDropdown';
import { adminNav, managerNav, customerNav } from '../../utils/navitems';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  const role = user?.role || 'guest';

  const navItems =
    role === 'admin' ? adminNav : role === 'manager' ? managerNav : customerNav;

  const isCustomer = role === 'customer';
  // Strict check for valid user session
  const isLoggedIn = user && user.email;

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl">🛒</div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-1">
            GROC
            <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md">
              E
            </span>
            AZY
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          {/* Wishlist & Cart (CUSTOMER ONLY) */}
          {isCustomer && (
            <>
              <Link
                to="/wishlist"
                className="p-2 rounded-full hover:bg-pink-50 text-pink-600 transition"
              >
                <Heart className="w-5 h-5" />
              </Link>

              <Link
                to="/cart"
                className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
            </>
          )}

          {/* User Profile / Sign In */}
          {isLoggedIn ? (
            <UserProfileDropdown />
          ) : (
            <Link
              to="/login"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 border rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-6 py-4 bg-white shadow-lg space-y-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
          />

          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {isCustomer && (
            <div className="flex gap-4">
              <Link
                to="/wishlist"
                className="flex-1 text-center py-2 rounded-lg bg-pink-100 text-pink-700"
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                className="flex-1 text-center py-2 rounded-lg bg-orange-500 text-white"
              >
                Cart
              </Link>
            </div>
          )}

          {isLoggedIn ? (
            <div className="pt-2 border-t border-gray-100">
              <div className="text-sm text-gray-700 font-medium mb-2">
                Hi, {user.name || user.email}
              </div>
              {/* Note: Ideally we want full mobile menu options here */}
            </div>
          ) : (
            <Link
              to="/login"
              className="block text-center bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
