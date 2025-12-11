import cards from '../../../utils/contactsupport';

export default function SupportContactCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 animate-slideUp">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`rounded-xl p-5 bg-gradient-to-br ${c.colors} 
            shadow-md border hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300 flex items-start gap-4`}
        >
          {c.icon}
          <div>
            <p className="font-semibold text-gray-800">{c.title}</p>
            <p className="text-gray-600 text-sm">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
