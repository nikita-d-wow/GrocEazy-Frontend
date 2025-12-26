import { useState, useEffect } from 'react';

const carouselImages = [
    {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
        alt: 'Fresh vegetables',
        title: 'Freshness Delivered',
        subtitle: 'Get the best quality groceries delivered to your doorstep.',
    },
    {
        url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1974&auto=format&fit=crop',
        alt: 'Organic fruits',
        title: 'Organic & Healthy',
        subtitle: 'Choose from a wide range of organic and healthy options.',
    },
    {
        url: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=1974&auto=format&fit=crop',
        alt: 'Grocery shopping',
        title: 'Seamless Shopping',
        subtitle: 'Experience the easiest way to shop for your daily needs.',
    },
];

export default function AuthCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-full w-full overflow-hidden bg-gray-900">
            {carouselImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={image.url}
                        alt={image.alt}
                        className="h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
            ))}

            <div className="absolute bottom-12 left-0 right-0 p-8 text-white z-10 transform transition-all duration-500">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">
                    {carouselImages[currentIndex].title}
                </h2>
                <p className="text-lg text-gray-200 max-w-md">
                    {carouselImages[currentIndex].subtitle}
                </p>

                <div className="flex gap-2 mt-6">
                    {carouselImages.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
