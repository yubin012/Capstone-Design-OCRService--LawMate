// src/api/auth.ts
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

// ✅ 회원가입 요청
export const signupWithEmailVerification = async (data: SignupData): Promise<void> => {
  await axios.post('/auth/signup', data);
};

// ✅ accessToken 반환 함수 (정확한 키명 사용)
export const getToken = (): string | null => {
  const token = localStorage.getItem('token'); // ✅ 여기 통일
  if (token) return token;
  return 'dummy-token-for-dev';
};

// ✅ JWT 헤더 생성 함수
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};
