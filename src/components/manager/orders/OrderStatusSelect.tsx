import { ORDER_STATUS_META, ORDER_STATUSES } from '../../../utils/orderStatus';

interface Props {
  status: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const OrderStatusSelect = ({ status, disabled, onChange }: Props) => {
  const meta = ORDER_STATUS_META[status];

  return (
    <div
      className={`
        relative
        inline-flex items-center
        rounded-xl
        px-3 py-1.5
        text-xs font-bold uppercase tracking-wider
        shadow-sm transition-all duration-300
        ${meta.bg} ${meta.text} ring-1 ${meta.ring}
        hover:shadow-md hover:scale-[1.02]
      `}
    >
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-transparent
          outline-none
          cursor-pointer
          disabled:cursor-not-allowed
          appearance-none
          pr-6
          text-[11px]
          min-w-[100px]
          font-black
        "
      >
        {ORDER_STATUSES.map((s) => (
          <option
            key={s}
            value={s}
            className="bg-white text-gray-900 font-medium normal-case"
          >
            {s}
          </option>
        ))}
      </select>

      {/* dropdown arrow */}
      <span className="absolute right-3 pointer-events-none text-[10px] opacity-60">
        ▼
      </span>
    </div>
  );
};

export default OrderStatusSelect;
