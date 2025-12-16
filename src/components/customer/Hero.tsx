import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import banner1 from '../../assets/banner_grocery_1.png';
import banner2 from '../../assets/banner_grocery_2.png';
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
    <section className="py-6 px-4 sm:px-6 lg:px-12">
      <div className="relative max-w-7xl mx-auto h-[220px] sm:h-[300px] md:h-[380px] rounded-3xl overflow-hidden shadow-xl group">
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
              src={slide.image}
              alt="Banner"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} backdrop-blur-[1px]`}
            ></div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 max-w-2xl">
              <div
                className={`w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border backdrop-blur-md ${slide.tagColor}`}
              >
                {slide.tag}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-3">
                {slide.title}
              </h1>

              <p className="text-gray-200 text-sm sm:text-lg mb-6 max-w-md font-medium">
                {slide.subtitle}
              </p>

              <Button
                onClick={() => navigate('/products')}
                className="w-fit !rounded-full !px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm sm:text-base"
                size="lg"
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
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
