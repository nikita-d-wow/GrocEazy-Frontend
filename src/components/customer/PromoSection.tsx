import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchCategories } from '../../redux/actions/categoryActions';
import { selectCategories } from '../../redux/selectors/categorySelectors';
import breakfastBanner from '../../assets/breakfast banner.jpg';
import veggiesBanner from '../../assets/banner 4.jpg';
import { getOptimizedImage } from '../../utils/imageUtils';

export default function PromoSection() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleNavigate = (term: string) => {
    const category = categories.find((c) =>
      c.name.toLowerCase().includes(term.toLowerCase())
    );
    if (category) {
      navigate(`/products?category=${category._id}`);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      {/* GRID WRAPPER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => handleNavigate('veggies')}
          className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md group cursor-pointer hover:shadow-xl transition-all"
        >
          <img
            src={getOptimizedImage(veggiesBanner, 800)}
            alt="Fresh Produce"
            loading="eager"
            // @ts-expect-error - fetchpriority is not yet in standard React types
            fetchpriority="high"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8">
            <h3 className="text-white text-2xl font-bold mb-2 w-2/3">
              Everyday Fresh & Clean
            </h3>
            <span className="text-green-300 font-medium">Shop Veggies →</span>
          </div>
        </div>

        <div
          onClick={() => handleNavigate('breakfast')}
          className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md group cursor-pointer hover:shadow-xl transition-all"
        >
          <img
            src={getOptimizedImage(breakfastBanner, 800)}
            alt="Healthy Breakfast"
            loading="eager"
            // @ts-expect-error - fetchpriority is not yet in standard React types
            fetchpriority="high"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8">
            <h3 className="text-white text-2xl font-bold mb-2 w-2/3">
              Healthy & Easy Breakfast
            </h3>
            <span className="text-yellow-300 font-medium">
              Shop Breakfast →
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
