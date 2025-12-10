import ProductCard from './ProductCard';

export default function ProductsSection() {
  const products = [
    { name: 'Tomatoes', image: '/img/tomato.png' },
    { name: 'Spices', image: '/img/spices.png' },
    { name: 'Lemon', image: '/img/lemon.png' },
    { name: 'Avocado', image: '/img/avocado.png' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Our All Products</h2>
        <a href="#" className="text-gray-500 hover:text-gray-700">
          View All
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((prod, idx) => (
          <ProductCard key={idx} {...prod} />
        ))}
      </div>
    </section>
  );
}
