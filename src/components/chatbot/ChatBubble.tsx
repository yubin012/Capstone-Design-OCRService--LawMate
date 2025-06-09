import React, { useEffect, useState } from 'react';

interface ChatBubbleProps {
  sender: 'user' | 'bot';
  text: string;
  timestamp?: string;
  type?: 'text' | 'suggest';
  options?: (string | { label: string; savedAt: string })[];
  onSelectSuggestion?: (text: string) => void;
  onDeleteSuggestion?: (savedAt: string) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  text,
  timestamp,
  type = 'text',
  options = [],
  onSelectSuggestion,
  onDeleteSuggestion,
}) => {
  const isUser = sender === 'user';
  const [typingText, setTypingText] = useState(text);

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
    <div className={`mb-3 flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-1`}>
      {isUser ? (
        <>
          <div className="inline-block max-w-[75%] px-4 py-2 rounded-lg break-words shadow bg-blue-600 text-white rounded-br-none">
            <div>{typingText}</div>
          </div>
          <div className="text-xs text-gray-500 mb-1 ml-1" aria-label="timestamp">
            {timestamp}
          </div>
        </>
      ) : (
        <>
          <div className="inline-block max-w-[75%] px-4 py-2 rounded-lg break-words shadow bg-gray-200 text-gray-800 rounded-bl-none">
            <div>{typingText}</div>

            {type === 'suggest' && options.length > 0 && (
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {options.map((opt, idx) => {
                  const isObj = typeof opt === 'object';
                  const label = isObj ? opt.label : opt;
                  const savedAt = isObj ? opt.savedAt : null;

                  return (
                    <div key={idx} className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectSuggestion?.(label)}
                        className="flex-grow text-sm text-left bg-white border border-blue-200 hover:bg-blue-50 px-3 py-2 rounded shadow-sm"
                      >
                        {label}
                      </button>
                      {savedAt && (
                        <button
                          onClick={() => onDeleteSuggestion?.(savedAt)}
                          className="text-xs text-red-500 hover:text-red-700"
                          title="삭제"
                        >
                          ❌
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-1 ml-1" aria-label="timestamp">
            {timestamp}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBubble;
