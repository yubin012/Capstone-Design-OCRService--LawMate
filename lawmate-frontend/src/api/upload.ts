// src/api/upload.ts
import axios from 'axios';

export interface UploadHistoryItem {
  id: number;
  filename: string;
  uploadedAt: string;
}

export const getUploadHistory = async (): Promise<UploadHistoryItem[]> => {
  const res = await axios.get('/api/uploads', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data;
};

// 📤 신규: 업로드 요청 함수 (현재는 사용 안하지만 예비용)
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return res.data;
};
