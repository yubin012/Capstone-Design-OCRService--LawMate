// src/components/ChatLogList.tsx
import React from 'react';

export interface ChatLog {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface ChatLogListProps {
  logs: ChatLog[];
}

const ChatLogList: React.FC<ChatLogListProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        챗봇 이용 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">💬 챗봇 이용 기록</h3>
      <ul className="divide-y divide-gray-200 text-sm">
        {logs.map((log) => (
          <li key={log.id} className="py-3 px-2">
            <div className="mb-1">
              <span className="font-semibold text-blue-700">Q:</span>{' '}
              <span>{log.question}</span>
            </div>
            <div className="mb-1">
              <span className="font-semibold text-gray-700">A:</span>{' '}
              <span className="text-gray-800">{log.answer}</span>
            </div>
            <div className="text-right text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleString('ko-KR')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatLogList;
