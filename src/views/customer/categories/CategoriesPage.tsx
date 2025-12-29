import { useEffect } from 'react';
import CategoryGrid from '../../../components/categories/CategoryGrid';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchCategories } from '../../../redux/actions/categoryActions';
import { useSelector } from 'react-redux';
import { selectCategories } from '../../../redux/selectors/categorySelectors';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-80 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Shop by Categories
        </h1>
        <CategoryGrid
          categories={categories.filter(
            (cat) => !cat.isDeleted && cat.isActive !== false
          )}
        />
      </div>
    </div>
  );
}
