interface Props {
  page: number;
  onChange?: (page: number) => void; // optional for safety
}

const OrderPagination = ({ page, onChange }: Props) => {
  const handleChange = (nextPage: number) => {
    if (typeof onChange === 'function') {
      onChange(nextPage);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 pt-10">
      <button
        disabled={page === 1}
        onClick={() => handleChange(page - 1)}
        className="px-6 py-2 rounded-full bg-white shadow text-sm disabled:opacity-40"
      >
        Prev
      </button>

      {[page - 1, page, page + 1]
        .filter((p) => p > 0)
        .map((p) => (
          <button
            key={p}
            onClick={() => handleChange(p)}
            className={`w-11 h-11 rounded-full text-sm font-medium ${
              p === page ? 'bg-black text-white' : 'bg-white shadow'
            }`}
          >
            {p}
          </button>
        ))}

      <button
        onClick={() => handleChange(page + 1)}
        className="px-6 py-2 rounded-full bg-black text-white text-sm shadow"
      >
        Next
      </button>
    </div>
  );
};

export default OrderPagination;
