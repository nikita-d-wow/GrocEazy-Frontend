import banner from '../../assets/main_banner_bg.png';

export default function Hero() {
  return (
    <section className="py-6 px-4 sm:px-6 lg:px-12">
      <div
        className="
          max-w-7xl mx-auto 
          relative 
          overflow-hidden 
          h-[220px] sm:h-[280px] md:h-[340px]
        "
      >
        {/* Background Image */}
        <img
          src={banner}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Text Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20">
          <div className="inline-flex items-center gap-2 bg-white/20 text-yellow-300 px-3 py-1 rounded-full mb-3 text-xs sm:text-sm w-fit backdrop-blur-sm">
            <span>🏷️</span>
            <span>Grocery Delivery Service</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            <span className="text-yellow-300">Fastest</span> Delivery <br />
            <span className="text-yellow-300">Easy</span> Pickup.
          </h1>

          <button className="mt-4 bg-orange-500 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-orange-600 w-fit">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
