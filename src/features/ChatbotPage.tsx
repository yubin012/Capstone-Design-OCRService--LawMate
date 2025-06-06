// src/features/ChatbotPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatBubble from '@/components/chatbot/ChatBubble';
import ChatInput from '@/components/chatbot/ChatInput';
import { loadChatHistory, saveChatHistory, clearChatHistory } from '@/utils/chatStorage';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    const stored = loadChatHistory();
    setMessages(stored);
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

      setMessages((prev) =>
        prev.filter((msg) => !(msg.sender === 'bot' && msg.text === '__typing__'))
      );

      if (type === 'suggest' && Array.isArray(suggestions)) {
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
    <div className="flex flex-col h-[calc(85vh-4rem)]">
      <div className="flex justify-between items-center px-4 pt-4">
        <h2 className="text-xl font-bold">법률 상담</h2>
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 hover:text-red-600 underline"
        >
          Chatbot 초기화
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto rounded shadow-inner p-4 space-y-5 bg-no-repeat bg-center bg-contain"
        style={{ 
          backgroundImage: `url('/chat_background_lawmate.png')`,
          backgroundSize: '50%', 
        }}
      >
        <div className="mb-6 text-center">
          <img
            src="/ai_law_icon_lawmate.png"
            alt="AI 법률 상담"
            className="mx-auto h-28 mb-4"
          />
          <h3 className="text-xl font-bold">AI 법률 상담 시작하기</h3>
          <p className="text-gray-600 mt-2">
            어떤 법적 문제를 겪고 계신가요? 아래에 입력해 주세요.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="bg-white p-4 rounded shadow text-center">
              <strong className="block font-bold mb-1">법률 문서 작성 지원</strong>
              계약서, 합의서, 고소장까지 필요한 문서를 손쉽게 작성하세요.
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <strong className="block font-bold mb-1">법률 상담 및 조언</strong>
              궁금한 법률 문제, LawMate가 빠르게 상담해 드립니다.
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <strong className="block font-bold mb-1">문서 템플릿 추천</strong>
              상황에 맞는 최적의 템플릿을 추천해드립니다.
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <strong className="block font-bold mb-1">리스크 분석 가이드</strong>
              문서 속 리스크와 수정 방향을 안내합니다.
            </div>
          </div>
        </div>

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

      <div className="border-t bg-white p-3 shadow-inner">
        <ChatInput onSend={handleSend} disabled={loading} inputRef={inputRef} />
      </div>
    </div>
  );
};

export default ChatbotPage;
