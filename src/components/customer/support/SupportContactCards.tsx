import cards from '../../../utils/contactsupport';

export default function SupportContactCards() {
  const handleCardClick = (c: any) => {
    if (c.isChat) {
      // Logic to open chat - assuming the chat widget is globally available
      // and we just need to let the user know they can use it or find a way to trigger it.
      // Usually, we might use a global state or search for the toggle button.
      const chatButton = document.getElementById(
        'chat-widget-toggle'
      ) as HTMLElement;
      if (chatButton) {
        chatButton.click();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 animate-slideUp">
      {cards.map((c, i) => (
        <div
          key={i}
          onClick={() => handleCardClick(c)}
          className={`rounded-2xl p-5 bg-gradient-to-br ${c.colors} 
            shadow-md border hover:shadow-xl hover:-translate-y-1 
            transition-all duration-300 flex items-start gap-4 cursor-pointer`}
        >
          <div className="shrink-0">{c.icon}</div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{c.title}</p>
            <p className="text-gray-600 text-xs leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
