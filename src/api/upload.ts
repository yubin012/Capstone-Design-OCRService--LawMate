// src/api/upload.ts
import axios from 'axios';

export interface UploadHistoryItem {
  id: string; // ✅ number → string (URL에 쓰이므로 보통 string이 안전)
  filename: string;
  uploadedAt: string;
}

// ✅ 공통 헤더 함수
const headers = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// 📥 업로드 이력 조회
export const getUploadHistory = async (): Promise<UploadHistoryItem[]> => {
  const res = await axios.get('/api/uploads', {
    headers: headers(),
  });
  return res.data;
};

// 📤 문서 업로드 요청 (예비용)
export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers(),
    },
  });

  return res.data;
};

// 📁 신규: 업로드된 원본 파일 다운로드
export const downloadOriginalFile = async (uploadId: string): Promise<Blob> => {
  const res = await axios.get(`/api/uploads/${uploadId}/download`, {
    headers: headers(),
    responseType: 'blob', // ✅ 파일 다운로드를 위해 Blob 타입 사용
  });
  return res.data;
};
