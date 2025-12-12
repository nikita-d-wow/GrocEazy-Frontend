interface CartSummaryProps {
  total: number;
}

export default function CartSummary({ total }: CartSummaryProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 h-fit sticky top-24 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-5 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span className="text-primary font-semibold">Free</span>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="flex justify-between text-2xl font-bold text-gray-900">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        className="
          w-full mt-8 bg-primary text-white font-semibold py-4 
          rounded-2xl text-lg shadow-lg 
          hover:bg-primary/90 active:scale-95 transition
        "
      >
        Proceed to Checkout →
      </button>
    </div>
  );
}
