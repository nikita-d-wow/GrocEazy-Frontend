import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
  total: number;
}

export default function CartSummary({ total }: CartSummaryProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-3xl shadow-xl border border-border p-8 h-fit sticky top-24 animate-fadeIn">
      <h2 className="text-2xl font-bold text-text">Order Summary</h2>

      <div className="mt-6 space-y-5 text-muted-text">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-text">₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="text-primary font-semibold">Free</span>
        </div>

        <hr className="my-4 border-border" />

        <div className="flex justify-between text-2xl font-bold text-text">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Compact Checkout Button */}
      <button
        onClick={() => navigate('/checkout')}
        className="
          mt-8 inline-flex items-center gap-2
          px-6 py-3
          bg-primary text-white
          text-sm font-semibold
          rounded-xl
          shadow-md
          hover:bg-primary/90
          active:scale-95
          transition cursor-pointer
        "
      >
        Proceed to Checkout
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
