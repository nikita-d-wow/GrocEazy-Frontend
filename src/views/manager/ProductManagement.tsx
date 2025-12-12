import type { FC } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';

import { useAppDispatch } from '../../redux/actions/useDispatch';
import { fetchProducts } from '../../redux/actions/productActions';
import { deleteProduct } from '../../redux/reducers/productReducer';
import {
  selectProducts,
  selectProductLoading,
} from '../../redux/selectors/productSelectors';

import type { Product } from '../../types/Product';

import ProductForm from '../../components/manager/ProductForm';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const ProductManagement: FC = () => {
  const dispatch = useAppDispatch();
  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductLoading);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [products, searchTerm]
  );

  if (loading && products.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage store inventory</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          Add Product
        </Button>
      </div>

      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        leftIcon={<Search className="w-5 h-5" />}
        className="max-w-md mb-6"
      />

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products"
          description="Start by adding products"
          icon={<Package className="w-12 h-12" />}
        />
      ) : (
        <table className="w-full bg-white rounded-2xl border">
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">₹{product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit2 />
                  </button>
                  <button onClick={() => dispatch(deleteProduct(product.id))}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isFormOpen && (
        <ProductForm
          key={editingProduct?.id ?? 'new'}
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;
