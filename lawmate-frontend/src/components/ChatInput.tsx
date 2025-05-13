// src/components/ChatInput.tsx
import React, { useState, useEffect } from 'react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, inputRef }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef?.current?.focus(), 10);
    }
  }, [disabled]);

  return (
    <div className="flex gap-2">
      <input
        type="text"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="flex-1 border rounded px-3 py-2 shadow-sm"
        placeholder="질문을 입력하세요"
        disabled={disabled}
      />
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={`px-4 py-2 rounded text-white ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {disabled ? '전송중...' : '전송'}
      </button>
    </div>
  );
};

export default ChatInput;
