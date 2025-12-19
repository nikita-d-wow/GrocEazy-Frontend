import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(path)}
      className={`rounded-xl p-4 cursor-pointer transition-all flex flex-col items-center shadow-md hover:shadow-lg h-full justify-center ${bgColor}`}
    >
      <img
        src={image}
        alt={text}
        className="w-16 h-16 object-contain mb-3 mix-blend-multiply transition-transform hover:rotate-6"
      />
      <p className="text-gray-900 font-bold text-center text-sm">{text}</p>
    </motion.div>
  );
}
