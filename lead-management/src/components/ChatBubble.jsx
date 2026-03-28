export default function ChatBubble({ message, isOwn, senderName, time }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <p className="mb-1 text-xs font-medium text-surface-muted">{senderName}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isOwn
              ? 'rounded-br-md bg-gradient-to-r from-primary-600 to-primary-700 text-white'
              : 'rounded-bl-md bg-white text-secondary-900 shadow-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-line">{message}</p>
        </div>
        <p className={`mt-1 text-xs text-surface-muted ${isOwn ? 'text-right' : 'text-left'}`}>
          {time}
        </p>
      </div>
    </div>
  );
}
