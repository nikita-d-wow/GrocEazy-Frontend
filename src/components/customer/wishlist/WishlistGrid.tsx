import { useSelector } from 'react-redux';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';
import type { WishlistItem } from '../../../redux/types/wishlistTypes';
import WishlistCard from './WishlistCard';

type Props = {
  items: WishlistItem[];
};

export default function WishlistGrid({ items }: Props) {
  const cartItems = useSelector(selectCartItems);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const isInCart = cartItems.some(
          (cartItem) => cartItem.product?._id === item.product?._id
        );
        return <WishlistCard key={item._id} item={item} isInCart={isInCart} />;
      })}
    </div>
  );
}
