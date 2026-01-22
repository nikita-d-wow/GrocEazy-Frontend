import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchProducts } from '../../redux/actions/productActions';
import {
  selectProducts,
  selectProductLoading,
} from '../../redux/selectors/productSelectors';
import ProductCard from './ProductCard';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import Skeleton from '../common/Skeleton';
import { ArrowRight, PackageX } from 'lucide-react';

export default function ProductsSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // Show only first 8 products
  const displayProducts = products
    .filter((p: any) => p.isActive !== false)
    .slice(0, 8);

  // Initial loading state (only if no products)
  if (loading && products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-8">
          <Skeleton variant="rect" width={200} height={40} />
          <Skeleton variant="rect" width={100} height={32} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col h-80"
            >
              <Skeleton width="100%" height={160} className="mb-4 rounded-xl" />
              <Skeleton variant="text" width="80%" />
              <div className="mt-auto flex justify-between">
                <Skeleton width={60} height={24} />
                <Skeleton width={80} height={32} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-16">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Our Products
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Fresh selections for you
          </p>
        </div>
        <Button
          onClick={() => navigate('/products')}
          variant="outline"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          View All
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No Products Found"
          description="We couldn't find any products at the moment. Please check back later."
          icon={<PackageX className="w-12 h-12 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.images[0] || '/img/placeholder.png'}
              stock={product.stock}
              categoryId={
                typeof product.categoryId === 'object'
                  ? product.categoryId?._id
                  : product.categoryId
              }
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
