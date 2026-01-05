import { useEffect, useState } from 'react';
import CategoryGrid from '../../../components/categories/CategoryGrid';
import { useAppDispatch } from '../../../redux/actions/useDispatch';
import { fetchPagedCategories } from '../../../redux/actions/categoryActions';
import { useSelector } from 'react-redux';
import Pagination from '../../../components/common/Pagination';
import type { RootState } from '../../../redux/store';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, pagination, loading } = useSelector(
    (state: RootState) => state.category
  );
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    dispatch(fetchPagedCategories(page, LIMIT));
  }, [dispatch, page]);

  const totalPages = pagination?.pages || 1;

  return (
    <div className="relative">
      <div className="absolute inset-0 opacity-80 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
          Shop by Categories
        </h1>

        {loading && categories.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <CategoryGrid
              categories={categories.filter(
                (cat) => !cat.isDeleted && cat.isActive !== false
              )}
            />

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
