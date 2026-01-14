import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import { Tag, Sparkles } from 'lucide-react';

export default function FloatingCategoryBar() {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, categories.length]);

  const visibleCategories = categories
    .filter((cat) => !cat.isDeleted && cat.isActive !== false)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 10);

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <div
      className={`sticky top-[65px] xs:top-[74px] z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'translate-y-0 opacity-100'
          : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2.5">
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 whitespace-nowrap shrink-0 hover:bg-green-100 transition-colors"
            >
              <Tag size={14} />
              All Items
            </Link>

            {visibleCategories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat._id}`}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-600 text-xs font-semibold border border-transparent whitespace-nowrap shrink-0 hover:bg-gray-100 transition-colors"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    className="w-4 h-4 rounded-full object-cover"
                    alt=""
                  />
                ) : (
                  <Sparkles size={14} className="text-green-500" />
                )}
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
