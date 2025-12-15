import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchProducts } from '../../redux/actions/productActions';
import { selectProducts } from '../../redux/selectors/productSelectors';
// import type { Product } from '../../types/Product';
import ProductCard from '../../components/products/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const product = products.find((p) => p._id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  // Get similar products (same category)
  const similarProducts = products
    .filter((p) => p.categoryId === product.categoryId && p._id !== product._id)
    .slice(0, 4);

  // Get "People Also Bought" (random for now, can be enhanced with actual data)
  const peopleAlsoBought = products
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // TODO: Add to cart Redux action
    toast.success(`Added to cart: ${product.name} (Quantity: ${quantity})`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl p-4 mb-4">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      idx === selectedImage
                        ? 'border-green-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            {product.size && (
              <p className="text-gray-500 mb-4">{product.size}</p>
            )}

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.price}
              </span>
            </div>

            {/* Stock Status */}
            {product.stock > 0 ? (
              <p className="text-green-600 font-medium mb-6">
                In stock ({product.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium mb-6">Out of stock</p>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3 bg-gray-50 w-fit px-4 py-3 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:bg-gray-200 p-2 rounded transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg min-w-[30px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="hover:bg-gray-200 p-2 rounded transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-colors mb-4"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Product Description */}
            {product.description && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Dietary Info */}
            {product.dietary && (
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {product.dietary}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Product Name:</span>
              <span className="text-gray-600 ml-2">{product.name}</span>
            </div>
            {product.size && (
              <div>
                <span className="font-medium text-gray-700">Size:</span>
                <span className="text-gray-600 ml-2">{product.size}</span>
              </div>
            )}
            {product.dietary && (
              <div>
                <span className="font-medium text-gray-700">Dietary:</span>
                <span className="text-gray-600 ml-2">{product.dietary}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Stock:</span>
              <span className="text-gray-600 ml-2">{product.stock} units</span>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* People Also Bought */}
        {peopleAlsoBought.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              People Also Bought
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {peopleAlsoBought.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
