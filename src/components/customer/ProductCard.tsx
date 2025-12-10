import type { Product } from '../../types/Product';

export default function ProductCard({ name, image }: Product) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition cursor-pointer">
      <img src={image} alt={name} className="w-full h-32 object-contain mb-4" />
      <p className="text-gray-900 font-medium text-center">{name}</p>
    </div>
  );
}
