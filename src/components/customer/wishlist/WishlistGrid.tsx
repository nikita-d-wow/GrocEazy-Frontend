import { useSelector } from 'react-redux';
import { selectCartItems } from '../../../redux/selectors/cartSelectors';
import WishlistCard from './WishlistCard';

type Props = {
  items: any[];
};

export default function WishlistGrid({ items }: Props) {
  const cartItems = useSelector(selectCartItems);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        const isInCart = cartItems.some(
          (cartItem) => cartItem.product?._id === item.product?._id
        );
        return <WishlistCard key={item._id} item={item} isInCart={isInCart} />;
      })}
    </div>
  );
}
