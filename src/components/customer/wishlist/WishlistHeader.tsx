import React from 'react';
import { Heart } from 'lucide-react';

interface HeaderProps {
  count: number;
  onClear: () => void;
}

const WishlistHeader: React.FC<HeaderProps> = ({ count, onClear }) => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary p-2 shadow-md">
          <Heart className="text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Your Wishlist</h2>
          <p className="text-sm text-slate-500">
            Saved items you loved — pick for today or save for later.
          </p>
        </div>
      </div>

      <button
        onClick={onClear}
        className="px-3 py-1.5 rounded-full border border-slate-200 text-sm hover:bg-slate-50 transition"
      >
        Clear
      </button>
    </header>
  );
};

export default WishlistHeader;
