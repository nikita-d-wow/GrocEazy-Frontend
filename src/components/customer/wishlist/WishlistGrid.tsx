import WishlistCard from './WishlistCard';

type Props = {
  items: any[];
};

export default function WishlistGrid({ items }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <WishlistCard key={item._id} item={item} />
      ))}
    </div>
  );
}
