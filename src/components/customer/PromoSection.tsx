import PromoCard from './PromoCard';

export default function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      {/* GRID WRAPPER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PromoCard
          bgColor="#FEF3C7"
          title="Everyday fresh & clean with our products"
          icon="👨‍🍳"
        />

        <PromoCard
          bgColor="#BBF7D0"
          title="Make your breakfast healthy and easy"
          icon="🍲"
        />
      </div>
    </section>
  );
}
