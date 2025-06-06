// src/components/chatbot/ChatInput.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paperclip, ArrowRight } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, inputRef }) => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

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
    <div className="flex justify-center w-full px-6 py-4 bg-white border-t shadow-md">
      <div className="flex items-center w-full max-w-4xl bg-gray-200 rounded-full px-4 py-2">
        {/* 첨부파일 버튼 */}
        <button
          onClick={() => navigate('/upload')}
          className="p-2 rounded-full hover:bg-blue-100"
          title="문서 업로드로 이동"
        >
          <Paperclip className="text-purple-600 w-5 h-5" />
        </button>

        {/* 입력 필드 */}
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
          className="flex-1 bg-gray-200 text-sm px-3 py-2 focus:outline-none"
          placeholder="type your prompt here"
          disabled={disabled}
        />

        {/* 전송 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className={`ml-2 p-2 rounded-full text-white transition ${
            disabled ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
          }`}
          title="전송"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
