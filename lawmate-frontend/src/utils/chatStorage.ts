// src/utils/chatStorage.ts
import { Message } from '@/features/ChatbotPage';

const STORAGE_KEY = 'chatHistory';

export const loadChatHistory = (): Message[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('⚠️ 채팅 기록 불러오기 실패:', error);
    return [];
  }
};

export const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('⚠️ 채팅 기록 저장 실패:', error);
  }
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('⚠️ 채팅 기록 초기화 실패:', error);
  }
};
