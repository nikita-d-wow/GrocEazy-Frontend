import { useNavigate } from 'react-router-dom';

export interface CategoryCard {
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
}: CategoryCard) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={`rounded-xl p-4 cursor-pointer hover:scale-105 transition flex flex-col items-center shadow-md hover:shadow-lg h-full justify-center ${bgColor}`}
    >
      <img
        src={image}
        alt={text}
        className="w-16 h-16 object-contain mb-3 mix-blend-multiply"
      />
      <p className="text-gray-900 font-bold text-center text-sm">{text}</p>
    </div>
  );
}
