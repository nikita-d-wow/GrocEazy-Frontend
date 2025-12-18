import type { CategoryCard } from '../components/customer/CategoryCard';

import organic_vegitable_image from '../assets/organic.png';
import fresh_fruits_image from '../assets/fruits.png';
import bottles_image from '../assets/drinks.png';
import dairy_product_image from '../assets/dairy.png';
import bakery_image from '../assets/bakery.png';
import grain_image from '../assets/grain.png';

export const categories: CategoryCard[] = [
  {
    text: 'Organic veggies',
    path: 'Vegetables',
    image: organic_vegitable_image,
    bgColor: '#FEF6DA',
  },
  {
    text: 'Fresh Fruits',
    path: 'Fruits',
    image: fresh_fruits_image,
    bgColor: '#FEE0E0',
  },
  {
    text: 'Cold Drinks',
    path: 'Drinks',
    image: bottles_image,
    bgColor: '#F0F5DE',
  },
  {
    text: 'Dairy Products',
    path: 'Dairy',
    image: dairy_product_image,
    bgColor: '#FEE6CD',
  },
  {
    text: 'Bakery & Breads',
    path: 'Bakery',
    image: bakery_image,
    bgColor: '#E0F6FE',
  },
  {
    text: 'Grains & Cereals',
    path: 'Grains',
    image: grain_image,
    bgColor: '#F1E3F9',
  },
];
