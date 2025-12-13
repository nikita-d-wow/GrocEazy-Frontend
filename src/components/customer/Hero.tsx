import { useNavigate } from 'react-router-dom';
import banner from '../../assets/main_banner_bg.png';
import Button from '../common/Button';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-12">
      <div
        className="
          max-w-7xl mx-auto 
          relative 
          overflow-hidden 
          rounded-3xl
          h-[220px] sm:h-[280px] md:h-[340px]
          shadow-xl
        "
      >
        {/* Background Image */}
        <img
          src={banner}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay with pastel gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-green-800/40"></div>

        {/* Text Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20">
          <div className="inline-flex items-center gap-2 bg-white/30 text-green-100 px-4 py-1.5 rounded-full mb-4 text-xs sm:text-sm w-fit backdrop-blur-md border border-white/20">
            <span>🏷️</span>
            <span className="font-medium">Grocery Delivery Service</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
            <span className="text-green-200">Fastest</span> Delivery <br />
            <span className="text-green-200">Easy</span> Pickup.
          </h1>

          <Button
            onClick={() => navigate('/products')}
            className="mt-6 w-fit"
            size="lg"
          >
            Shop Now →
          </Button>
        </div>
      </div>
    </section>
  );
}
