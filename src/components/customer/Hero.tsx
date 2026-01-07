import { useNavigate } from 'react-router-dom';
// Force re-index of image utility
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
//import { motion } from 'framer-motion';
import banner1 from '../../assets/banner_veggies.jpg';
import banner2 from '../../assets/banner_grocery_2.png';
import { getOptimizedImage } from '../../utils/imageUtils';
import Button from '../common/Button';

const SLIDES = [
  {
    id: 1,
    image: banner1,
    title: (
      <>
        <span className="text-green-300">Fresh</span> Vegetables <br />
        <span className="text-white">Straight to You.</span>
      </>
    ),
    subtitle: 'From local farms to your doorstep in minutes.',
    gradient: 'from-green-900/80 to-transparent',
    tag: 'Farm Fresh',
    tagColor: 'bg-green-500/20 text-green-100 border-green-500/30',
  },
  {
    id: 2,
    image: banner2,
    title: (
      <>
        <span className="text-blue-300">Daily</span> Essentials <br />
        <span className="text-white">Delivered Fast.</span>
      </>
    ),
    subtitle: 'Milk, bread, eggs & more at best prices.',
    gradient: 'from-blue-900/80 to-transparent',
    tag: 'Daily Needs',
    tagColor: 'bg-blue-500/20 text-blue-100 border-blue-500/30',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-4 px-3 sm:py-6 sm:px-6 lg:px-12">
      <div className="relative max-w-7xl mx-auto h-[180px] xs:h-[220px] sm:h-[300px] md:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md sm:shadow-xl group">
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image */}
            <img
              src={getOptimizedImage(slide.image, 1280)}
              alt="Banner"
              loading="eager"
              // @ts-expect-error - fetchpriority is not yet in standard React types
              fetchpriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} backdrop-blur-[1px]`}
            ></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-6 sm:px-16 lg:px-24 max-w-2xl">
              <div
                className={`w-fit px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-4 border backdrop-blur-md ${slide.tagColor}`}
              >
                {slide.tag}
              </div>

              <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-1 sm:mb-3">
                {slide.title}
              </h1>

              <p className="text-slate-200 text-[10px] xs:text-[11px] sm:text-base md:text-lg mb-3 sm:mb-6 max-w-sm sm:max-w-md font-medium line-clamp-2 sm:line-clamp-none">
                {slide.subtitle}
              </p>

              <Button
                onClick={() => navigate('/products')}
                className="
                  w-fit
                  !rounded-full
                  !px-6 sm:!px-10
                  !py-2 sm:!py-3.5
                  text-xs sm:text-lg
                  font-bold
                  text-white
                  bg-emerald-600
                  hover:bg-emerald-500
                  shadow-lg shadow-emerald-600/30
                  hover:shadow-emerald-500/50
                  hover:scale-105
                  transition-all duration-300
                  border-none
                  relative
                  overflow-hidden
                "
                size="lg"
                rightIcon={
                  <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 ml-1" />
                }
              >
                <div className="btn-shimmer" />
                Shop Now
              </Button>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-white'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
