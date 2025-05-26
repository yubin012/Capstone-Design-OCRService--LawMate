// src/api/auth.ts
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export interface SignupData {
  name: string;
  email: string;  
  password: string;
}

// ✅ 회원가입 요청 (이메일 인증 포함 여부는 백엔드 구현에 따라 다름)
export const signupWithEmailVerification = async (data: SignupData): Promise<void> => {
  await axios.post('/auth/signup', data);
};

// ✅ 이메일 중복 확인 요청
export const checkEmail = async (email: string): Promise<{ exists: boolean }> => {
  const response = await axios.post('/api/check-email', { email });
  return response.data;
};
