import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import UserProfileDropdown from './UserProfileDropdown';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="text-2xl">🛒</div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-1">
            GROC
            <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md text-2xl leading-none">
              E
            </span>
            AZY
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#">Home</a>
          <a href="#">Catalog</a>
          <a href="#">Shop</a>
          <a href="#">Contact</a>
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>

          <button className="bg-orange-500 p-2 rounded-full text-white">
            <ShoppingCart className="w-5 h-5" />
          </button>

          {user ? (
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
            placeholder="Search"
            className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm"
          />

          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            <a href="#">Home</a>
            <a href="#">Catalog</a>
            <a href="#">Shop</a>
            <a href="#">Contact</a>
          </div>

          {user ? (
            <button
              className="w-full text-left font-medium text-gray-700 bg-gray-50 p-2 rounded"
              onClick={() => { /* Mobile profile nav logic could go here */ }}
            >
              Hi, {user.name || user.email}
            </button>
          ) : (
            <Link
              to="/login"
              className="block text-center bg-green-700 text-white px-6 py-2 rounded-lg font-medium w-full"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
