import axios from 'axios';
import { getAuthHeaders } from './auth';
import { IS_USE_MOCK_API } from '@/routes/config';

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
  if (IS_USE_MOCK_API) {
    return {
      answer: `더미 응답입니다: ${question}`,
      type: 'suggest',
      suggestions: ['추천 질문 A', '추천 질문 B'],
    };
  }

  const res = await axios.post('/api/chatbot', { question });
  return res.data;
};

// ✅ 챗봇 대화 저장
export const saveChatLog = async (messages: { role: 'user' | 'bot'; content: string }[]): Promise<void> => {
  if (IS_USE_MOCK_API) return;
  await axios.post('/api/chat/save', { messages });
};

// ✅ 대화 이력 불러오기
export const getChatLogs = async (): Promise<ChatLogItem[]> => {
  if (IS_USE_MOCK_API) {
    return [
      {
        id: '1',
        question: '계약서에 서명 안하면 불이익이 있나요?',
        answer: '계약의 법적 효력을 위해 서명이 필요합니다.',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const res = await axios.get('/api/chat-logs');
  return res.data;
};

// ✅ 첫 상담 시작 API
export const startChat = async (startment: string) => {
  const headers = getAuthHeaders();
  console.debug('[DEBUG] startChat headers:', headers);

  const res = await axios.post(
    '/api/consult/startChat',
    { startment },
    { headers }
  );
  return res.data as {
    message: string;
    consultationId: number;
  };
};

// ✅ 상담 중 대화 API
export const continueChat = async (
  consultationId: number,
  messages: { role: string; content: string }[]
) => {
  const headers = getAuthHeaders();
  console.debug('[DEBUG] continueChat headers:', headers);

  const res = await axios.post(
    '/api/consult/chat',
    { consultationId, messages },
    { headers }
  );
  return res.data as {
    message: string;
    consultationId: number;
  };
};
