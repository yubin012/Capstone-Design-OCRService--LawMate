// src/api/bookmark.ts
import axios from 'axios';
import { getToken } from '@/utils/auth';

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// 📌 전체 북마크 조회
export const getBookmarks = async () => {
  const res = await axios.get('/api/bookmarks', { headers: headers() });
  return res.data;
};

// ✅ 북마크 추가
export const addBookmark = async (reportId: string, title: string) => {
  await axios.post('/api/bookmarks', { reportId, title }, { headers: headers() });
};

// ✅ 북마크 삭제
export const removeBookmark = async (reportId: string) => {
  await axios.delete(`/api/bookmarks/${reportId}`, { headers: headers() });
};
