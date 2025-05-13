// src/features/ChatbotPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatBubble from '@/components/ChatBubble';
import ChatInput from '@/components/ChatInput';
import { loadChatHistory, saveChatHistory, clearChatHistory } from '@/utils/chatStorage';

export interface Message {
  sender: 'user' | 'bot';
  text: string;
  type?: 'text' | 'suggest';
  options?: string[];
  timestamp?: string;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = loadChatHistory();
    setMessages(stored);
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const typeBotReply = async (text: string) => {
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let typed = '';
    for (let i = 0; i < text.length; i++) {
      typed += text[i];
      setMessages((prev) => [...prev.slice(0, -1), { sender: 'bot', text: typed, timestamp: getTime() }]);
      await delay(20);
    }
  };

  const handleSend = async (input: string) => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: input, timestamp: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setMessages((prev) => [...prev, { sender: 'bot', text: '__typing__', timestamp: getTime() }]);

    try {
      const res = await axios.post('/api/chatbot', { question: input });
      const { answer, type, suggestions } = res.data;

      // remove typing bubble
      setMessages((prev) =>
        prev.filter((msg) => !(msg.sender === 'bot' && msg.text === '__typing__'))
      );

      if (type === 'suggest' && Array.isArray(suggestions)) {
        // ✅ 추천 질문 말풍선 처리
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: answer || '다음 중 선택해 주세요.',
            type: 'suggest',
            options: suggestions,
            timestamp: getTime(),
          },
        ]);
      } else {
        // ✅ 일반 답변 애니메이션
        setMessages((prev) => [...prev, { sender: 'bot', text: '', timestamp: getTime() }]);
        await typeBotReply(answer || '응답을 받아올 수 없습니다.');
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev.filter((msg) => !(msg.sender === 'bot' && msg.text === '__typing__')),
        { sender: 'bot', text: '❗ 오류가 발생했습니다. 다시 시도해주세요.', timestamp: getTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    clearChatHistory();
    setMessages([]);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">💬 챗봇 상담</h2>

      <div className="flex justify-end mb-2">
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-600 underline"
        >
          🗑️ 대화 초기화
        </button>
      </div>

      <div className="border rounded p-4 h-[400px] overflow-y-auto bg-gray-50 mb-4 shadow-sm">
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            sender={msg.sender}
            text={msg.text}
            type={msg.type}
            options={msg.options}
            timestamp={msg.timestamp}
            onSelectSuggestion={handleSend}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={loading} inputRef={inputRef} />
    </div>
  );
};

export default ChatbotPage;
