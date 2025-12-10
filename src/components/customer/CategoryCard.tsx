import type { Category } from '../../types/Category';

export default function CategoryCard({ image, text, bgColor }: Category) {
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="rounded-xl p-4 cursor-pointer hover:scale-105 transition flex flex-col items-center"
    >
      <img src={image} alt={text} className="w-16 h-16 object-contain" />
      <p className="text-gray-800 font-medium mt-3">{text}</p>
    </div>
  );
}
