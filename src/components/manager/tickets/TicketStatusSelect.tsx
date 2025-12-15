import type { TicketStatus } from '../../../redux/types/support.types';

interface Props {
  status: TicketStatus;
  disabled: boolean;
  onChange: (status: TicketStatus) => void;
}

export default function TicketStatusSelect({
  status,
  disabled,
  onChange,
}: Props) {
  return (
    <select
      value={status} // ✅ status is USED
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as TicketStatus)}
      className="
        rounded-lg border border-gray-300
        px-3 py-2 text-sm bg-white
        focus:ring-2 focus:ring-primary/30
        disabled:opacity-50
      "
    >
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="resolved">Resolved</option>
      <option value="closed">Closed</option>
    </select>
  );
}
