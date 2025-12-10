interface PromoCardProps {
  bgColor: string;
  title: string;
  icon: string;
}

export default function PromoCard({ bgColor, title, icon }: PromoCardProps) {
  return (
    <div
      className="rounded-2xl p-8 flex items-center justify-between"
      style={{ backgroundColor: bgColor }}
    >
      <h3 className="text-2xl font-bold text-gray-900 w-2/3">{title}</h3>
      <div className="text-7xl">{icon}</div>
    </div>
  );
}
