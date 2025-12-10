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
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shop by Categories
      </h1>
      <CategoryGrid categories={categories} />
    </div>
  );
}
