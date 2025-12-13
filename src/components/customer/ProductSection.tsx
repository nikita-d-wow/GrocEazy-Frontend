import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchProducts } from '../../redux/actions/productActions';
import { selectProducts } from '../../redux/selectors/productSelectors';
import ProductCard from './ProductCard';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';

export default function ProductsSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useSelector(selectProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Show only first 8 products
  const displayProducts = products.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Products
          </h2>
          <p className="text-gray-500 mt-1">Fresh selections for you</p>
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
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product._id}
              _id={product._id}
              name={product.name}
              price={product.price}
              image={product.images[0] || '/img/placeholder.png'}
              stock={product.stock}
            />
          ))}
        </div>
      )}
    </section>
  );
}
