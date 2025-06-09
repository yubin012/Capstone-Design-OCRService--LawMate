import axios from 'axios';

export interface UploadHistoryItem {
  id: string; // 파일 ID (string 타입이 URL에 안전)
  filename: string;
  uploadedAt: string;
}

// ✅ 공통 헤더
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

// 📤 파일 업로드 (파일을 백엔드에 전송하고 fileId 반환)
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers(),
    },
  });

  // ✅ fileId 포함한 응답 구조 가정
  const { fileId } = res.data;
  return fileId;
};

// 📁 업로드된 원본 파일 다운로드
export const downloadOriginalFile = async (uploadId: string): Promise<Blob> => {
  const res = await axios.get(`/api/uploads/${uploadId}/download`, {
    headers: headers(),
    responseType: 'blob', // ✅ 다운로드용
  });
  return res.data;
};
