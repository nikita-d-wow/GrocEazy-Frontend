import type { AppDispatch } from '../store';
import { setProducts, setLoading, setError } from '../reducers/productReducer';
import type { Product } from '../../types/product';

export const fetchProducts = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Fresh Bananas',
        slug: 'fresh-bananas',
        description: 'Organic bananas',
        price: 40,
        discountPrice: 35,
        stock: 50,
        categoryId: '1',
        images: ['https://images.unsplash.com/photo-1603833665858'],
        rating: 4.5,
        reviewsCount: 120,
        isFeatured: true,
      },
      {
        id: '2',
        name: 'Red Apples',
        slug: 'red-apples',
        description: 'Juicy apples',
        price: 120,
        stock: 30,
        categoryId: '1',
        images: ['https://images.unsplash.com/photo-1560806887'],
      },
    ];

    setTimeout(() => {
      dispatch(setProducts(mockProducts));
      dispatch(setLoading(false));
    }, 600);
  } catch {
    dispatch(setError('Failed to fetch products'));
    dispatch(setLoading(false));
  }
};
