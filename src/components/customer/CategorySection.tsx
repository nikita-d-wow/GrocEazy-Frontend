import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import CategoryCard from './CategoryCard';
import Skeleton from '../common/Skeleton';
import { categoryBgVariants } from '../../utils/colors';

export default function CategoriesSection() {
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Filter out deleted categories
  // Filter out deleted categories and sort by creation date (earliest first)
  const visibleCategories = [...categories]
    .filter((cat) => !cat.isDeleted && cat.isActive !== false)
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 8); // Show max 8 categories

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
      <div className="mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Shop By Category
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Explore our collection</p>
        </div>
      </div>

      {visibleCategories.length === 0 ? (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton
                variant="rect"
                width={80}
                height={80}
                className="mb-3 rounded-xl"
              />
              <Skeleton variant="text" width={60} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
          {visibleCategories.map((cat, index) => {
            const bgClass =
              categoryBgVariants[index % categoryBgVariants.length];
            return (
              <CategoryCard
                key={cat._id}
                text={cat.name}
                path={`/products?category=${cat._id}`}
                image={
                  cat.image || `https://ui-avatars.com/api/?name=${cat.name}`
                }
                bgColor={bgClass}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
