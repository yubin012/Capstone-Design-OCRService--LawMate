import axios from 'axios';
import { getToken } from '@/utils/auth';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  downloadCount?: number; // ✅ 총 다운로드 횟수 필드 추가 (선택적)
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const token = getToken();
  if (!token) {
    throw new Error('토큰이 존재하지 않습니다.');
  }

  try {
    const res = await axios.get<UserInfo>('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('❗ 사용자 정보 요청 실패:', error);
    throw error;
  }
};
