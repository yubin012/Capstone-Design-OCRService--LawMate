// src/utils/chatStorage.ts
import type { Message } from '@/features/ChatbotPage';

const MESSAGE_KEY = 'chatHistory';
const ID_KEY = 'consultationId';

// 채팅 기록 로드
export function loadChatHistory(): Message[] {
  try {
    const saved = localStorage.getItem(MESSAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('채팅 기록 로드 실패:', error);
    return [];
  }
}

// 채팅 기록 저장
export function saveChatHistory(messages: Message[]) {
  try {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('채팅 기록 저장 실패:', error);
  }
}

// 채팅 기록 초기화
export function clearChatHistory() {
  try {
    localStorage.removeItem(MESSAGE_KEY);
    localStorage.removeItem(ID_KEY);
  } catch (error) {
    console.error('채팅 기록 초기화 실패:', error);
  }
}

// 상담 ID 저장
export function saveConsultationId(id: number) {
  localStorage.setItem(ID_KEY, id.toString());
}

// 상담 ID 로드
export function loadConsultationId(): number | null {
  const raw = localStorage.getItem(ID_KEY);
  return raw ? parseInt(raw, 10) : null;
}
