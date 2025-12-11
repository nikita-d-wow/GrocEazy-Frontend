import type { Category } from '../../types/Category';
import {
  setCategories,
  setLoading,
  setError,
} from '../reducers/categoryReducer';

export const fetchCategories = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Fruits',
        slug: 'fruits',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
      },
      {
        id: '2',
        name: 'Vegetables',
        slug: 'vegetables',
        image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
      },
    ];

    setTimeout(() => {
      dispatch(setCategories(mockCategories));
      dispatch(setLoading(false));
    }, 600);
  } catch {
    dispatch(setError('Failed to fetch categories'));
    dispatch(setLoading(false));
  }
};
