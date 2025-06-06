import axios from 'axios';
import { getToken } from '@/utils/auth';
import { IS_USE_MOCK_API } from '@/routes/config';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  downloadCount?: number; // 선택적, 총 다운로드 횟수 등
}

// 사용자 정보 조회
export const getUserInfo = async (): Promise<UserInfo> => {
  if (IS_USE_MOCK_API) {
    // MOCK API용 더미 사용자 정보 반환
    return {
      id: 'dummy-user',
      name: '더미 사용자',
      email: 'dummy@example.com',
      joinedAt: new Date().toISOString(),
      downloadCount: 123,
    };
  }

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

// 사용자 탈퇴 API
export const deleteAccount = async (): Promise<void> => {
  if (IS_USE_MOCK_API) {
    // MOCK 모드면 API 호출 없이 바로 성공 처리
    return;
  }

  const token = getToken();
  if (!token) throw new Error('인증 토큰이 없습니다.');

  try {
    await axios.delete('/api/user/delete', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('❗ 사용자 탈퇴 실패:', error);
    throw error;
  }
};

// 사용자 정보 수정 API
export const updateUserInfo = async (
  data: { name: string; phone: string; password?: string }
): Promise<void> => {
  if (IS_USE_MOCK_API) {
    // MOCK 모드면 API 호출 없이 바로 성공 처리
    return;
  }

  const token = getToken();
  if (!token) throw new Error('인증 토큰이 없습니다.');

  try {
    await axios.put('/api/user/update', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('❗ 사용자 정보 수정 실패:', error);
    throw error;
  }
};
