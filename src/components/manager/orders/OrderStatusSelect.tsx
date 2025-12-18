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
      className={`inline-flex items-center rounded-full px-6 py-2 text-sm font-medium ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}
    >
      <select
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent outline-none cursor-pointer disabled:cursor-not-allowed"
      >
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OrderStatusSelect;
