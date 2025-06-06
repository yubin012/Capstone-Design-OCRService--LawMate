// src/components/BookmarkToggleButton.tsx

import React, { useEffect, useState } from 'react';
import {
  addBookmark,
  getBookmarks,
  removeBookmark,
} from '@/api/bookmark';
import { BookmarkItem } from './BookmarkList';

interface Props {
  reportId: string;
  title: string;
}

const BookmarkToggleButton: React.FC<Props> = ({ reportId, title }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const list: BookmarkItem[] = await getBookmarks();
        setBookmarked(list.some((b: BookmarkItem) => b.id === reportId));
      } catch (err) {
        console.error('북마크 상태 확인 실패:', err);
      }
    };
    fetchBookmarks();
  }, [reportId]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(reportId);
      } else {
        await addBookmark(reportId, title);
      }
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error('북마크 처리 중 오류 발생:', err);
      alert('북마크 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-sm px-3 py-1 rounded border ${
        bookmarked
          ? 'bg-yellow-400 text-white hover:bg-yellow-500'
          : 'bg-white text-yellow-600 border-yellow-400 hover:bg-yellow-50'
      }`}
    >
      {bookmarked ? '북마크 해제' : '북마크'}
    </button>
  );
};

export default BookmarkToggleButton;
