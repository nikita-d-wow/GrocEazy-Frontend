import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import CategoryCard from './CategoryCard';
import { categoryBgVariants } from '../../utils/colors';

export default function CategoriesSection() {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter out deleted categories
  const visibleCategories = categories
    .filter((cat) => !cat.isDeleted)
    .slice(0, 8); // Show max 8 categories

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Shop By Category
        </h2>
        <p className="text-gray-500 mt-1">Explore our collection</p>
      </div>

      {visibleCategories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {visibleCategories.map((cat, index) => (
            <CategoryCard
              key={cat._id}
              text={cat.name}
              path={`/products?category=${cat._id}`}
              image={
                cat.image || `https://ui-avatars.com/api/?name=${cat.name}`
              }
              bgColor={categoryBgVariants[index % categoryBgVariants.length]}
            />
          ))}
        </div>
      )}
    </section>
  );
}
