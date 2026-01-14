import { useSelector } from 'react-redux';
import { selectTopProducts } from '../../redux/selectors/productSelectors';
import ProductCard from './ProductCard';
import { Timer, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DealOfTheDay() {
  const topProducts = useSelector(selectTopProducts);
  const [timeLeft, setTimeLeft] = useState('08:45:12');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();

      const h = Math.floor(diff / (1000 * 60 * 60))
        .toString()
        .padStart(2, '0');
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, '0');
      const s = Math.floor((diff % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, '0');

      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProduct = topProducts[0];

  if (!dealProduct) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <div className="bg-gradient-to-br from-green-900 to-emerald-800 rounded-[32px] overflow-hidden shadow-2xl relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-green-300 font-bold uppercase tracking-[0.2em] text-xs mb-4">
              <Zap size={16} fill="currentColor" />
              Deal of the Day
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Get <span className="text-green-400">20% OFF</span> on <br />
              Premium Essentials
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                  Ends In
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-2xl font-bold">
                  <Timer size={20} className="text-green-400" />
                  {timeLeft}
                </div>
              </div>

              <button className="px-10 py-4 bg-white text-green-900 font-bold rounded-2xl hover:bg-green-50 transition-all hover:scale-105 shadow-lg active:scale-95">
                Shop the Deal
              </button>
            </div>
          </div>

          {/* Product Preview Card */}
          <div className="w-full max-w-[280px] rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white p-4 rounded-3xl shadow-2xl">
              <ProductCard
                _id={dealProduct._id}
                name={dealProduct.name}
                image={dealProduct.images[0]}
                price={dealProduct.price}
                stock={dealProduct.stock}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
