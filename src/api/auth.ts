// src/api/auth.ts

import axios from 'axios';
import { getToken } from '@/utils/auth'; // 토큰은 utils에서 import

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

// ✅ JWT 인증 헤더 생성 함수
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found in localStorage');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
