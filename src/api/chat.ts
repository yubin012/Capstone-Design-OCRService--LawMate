// src/api/chat.ts - 챗봇 관련 백엔드 연동 API

import axios from 'axios';

export interface ChatLogItem {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface BotResponse {
  answer: string;
  type?: 'text' | 'suggest';
  suggestions?: string[];
}

// ✅ 챗봇 응답 요청
export const sendChatToBot = async (question: string): Promise<BotResponse> => {
  const res = await axios.post('/api/chatbot', { question });
  return res.data;
};

// ✅ 챗봇 대화 저장
export const saveChatLog = async (messages: { role: 'user' | 'bot'; content: string }[]): Promise<void> => {
  await axios.post('/api/chat/save', { messages });
};

// ✅ 대화 이력 불러오기
export const getChatLogs = async (): Promise<ChatLogItem[]> => {
  const res = await axios.get('/api/chat-logs');
  return res.data;
};
