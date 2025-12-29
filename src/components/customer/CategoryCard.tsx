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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(path)}
      className={`rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center shadow-md hover:shadow-lg h-full justify-center ${bgColor}`}
    >
      <div className="w-16 h-16 flex items-center justify-center mb-3">
        <img
          src={getOptimizedImage(image, 128)} // Request 128px for 2x retina
          alt={text}
          loading="lazy"
          className="w-full h-full object-contain mix-blend-multiply transition-transform hover:rotate-6"
        />
      </div>
      <p className="text-gray-900 font-bold text-center text-sm line-clamp-1">
        {text}
      </p>
    </motion.div>
  );
}
