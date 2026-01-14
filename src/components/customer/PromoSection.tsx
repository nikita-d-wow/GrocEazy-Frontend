import { useEffect } from 'react';
// Force re-index
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
          className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md group cursor-pointer hover:shadow-2xl transition-all duration-500 [perspective:1000px] border border-gray-100"
        >
          <div className="absolute inset-0 transition-transform duration-500 group-hover:[transform:rotateY(5deg)_rotateX(2deg)_scale(1.02)]">
            <img
              src={getOptimizedImage(veggiesBanner, 800)}
              alt="Fresh Produce"
              loading="eager"
              // @ts-expect-error - fetchpriority is not yet in standard React types
              fetchpriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <div className="w-fit px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-green-500/30 backdrop-blur-md">
                Fresh Picks
              </div>
              <h3 className="text-white text-2xl font-bold mb-2 w-2/3 leading-tight">
                Everyday Fresh & Clean
              </h3>
              <span className="text-green-300 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Shop Veggies <span className="text-lg">→</span>
              </span>
            </div>
          </div>
        </div>

        <div
          onClick={() => handleNavigate('breakfast')}
          className="relative h-48 sm:h-56 rounded-3xl overflow-hidden shadow-md group cursor-pointer hover:shadow-2xl transition-all duration-500 [perspective:1000px] border border-gray-100"
        >
          <div className="absolute inset-0 transition-transform duration-500 group-hover:[transform:rotateY(-5deg)_rotateX(2deg)_scale(1.02)]">
            <img
              src={getOptimizedImage(breakfastBanner, 800)}
              alt="Healthy Breakfast"
              loading="eager"
              // @ts-expect-error - fetchpriority is not yet in standard React types
              fetchpriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
              <div className="w-fit px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-yellow-500/30 backdrop-blur-md">
                Healthy Start
              </div>
              <h3 className="text-white text-2xl font-bold mb-2 w-2/3 leading-tight">
                Healthy & Easy Breakfast
              </h3>
              <span className="text-yellow-300 font-medium group-hover:translate-x-2 transition-transform inline-flex items-center gap-1">
                Shop Breakfast <span className="text-lg">→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
