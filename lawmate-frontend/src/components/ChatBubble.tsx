// src/components/ChatBubble.tsx
import React, { useEffect, useState } from 'react';

interface ChatBubbleProps {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
  type?: 'text' | 'suggest';
  options?: string[];
  onSelectSuggestion?: (text: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  timestamp,
  type = 'text',
  options = [],
  onSelectSuggestion,
}) => {
  const isUser = sender === 'user';
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    if (text !== '__typing__') {
      setTypingText(text);
      return;
    }

    let step = 0;
    const dots = ['.', '..', '...'];
    const interval = setInterval(() => {
      setTypingText(dots[step % dots.length]);
      step++;
    }, 400);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`inline-block px-4 py-2 rounded-lg max-w-[75%] break-words shadow focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
        tabIndex={0}
      >
        <div>{typingText}</div>
        {type === 'suggest' && options.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion?.(opt)}
                className="text-sm text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {timestamp && (
          <div className="text-xs text-right mt-1 opacity-60">{timestamp}</div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
