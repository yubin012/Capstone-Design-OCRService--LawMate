// src/components/BookmarkList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface BookmarkItem {
  id: string;
  title: string;
  createdAt: string;
}

interface BookmarkListProps {
  bookmarks: BookmarkItem[];
}

const BookmarkList: React.FC<BookmarkListProps> = ({ bookmarks }) => {
  const navigate = useNavigate();

  if (bookmarks.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        북마크한 리포트가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">⭐ 북마크한 분석 결과</h3>
      <ul className="divide-y divide-gray-200 text-sm">
        {bookmarks.map((item) => (
          <li
            key={item.id}
            onClick={() => navigate(`/result?id=${item.id}`)}
            className="py-2 cursor-pointer hover:bg-yellow-50 px-2 rounded transition"
          >
            <div className="flex justify-between">
              <span className="font-medium text-yellow-600">{item.title}</span>
              <span className="text-gray-500 text-xs">{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkList;
