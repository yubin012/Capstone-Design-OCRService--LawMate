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

  // 타이핑 애니메이션
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
      {/* 사용자 말풍선 + 오른쪽 시간 */}
      {isUser && (
        <>
          <div
            className="text-xs text-gray-500 mb-1"
            aria-label="timestamp"
          >
            {timestamp}
          </div>
          <div
            className="inline-block max-w-[75%] px-4 py-2 rounded-lg break-words shadow bg-blue-600 text-white rounded-br-none"
            tabIndex={0}
          >
            <div>{typingText}</div>
          </div>
        </>
      )}

      {/* 챗봇 말풍선 + 왼쪽 시간 */}
      {!isUser && (
        <>
          <div
            className="inline-block max-w-[75%] px-4 py-2 rounded-lg break-words shadow bg-gray-200 text-gray-800 rounded-bl-none"
            tabIndex={0}
          >
            <div>{typingText}</div>

            {/* 추천 질문 옵션 (챗봇 전용) */}
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
          </div>
          <div
            className="text-xs text-gray-500 mb-1"
            aria-label="timestamp"
          >
            {timestamp}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBubble;
