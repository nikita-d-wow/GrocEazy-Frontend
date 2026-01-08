import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOptimizedImage } from '../../utils/imageUtils';

export interface CategoryCardProps {
  text: string;
  path: string;
  image: string;
  bgColor: string;
}

export default function CategoryCard({
  image,
  text,
  path,
  bgColor,
}: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className={`rounded-2xl p-4 cursor-pointer transition-all flex flex-col items-center shadow-sm hover:shadow-md h-full justify-center ${bgColor} border border-transparent hover:border-black/5 relative overflow-hidden group`}
    >
      <div className="w-16 h-16 flex items-center justify-center mb-3 relative z-10">
        <img
          src={getOptimizedImage(image, { width: 128, height: 128 })} // Request 128px for 2x retina
          alt={text}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 drop-shadow-sm"
        />
      </div>
      <p className="text-gray-900 font-bold text-center text-sm md:text-[15px] line-clamp-1 relative z-10 tracking-tight">
        {text}
      </p>
    </motion.div>
  );
}
