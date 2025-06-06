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

// 인증 토큰 반환 함수
export const getToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (token) return token;

  // 임시 더미 토큰 반환 (실제 백엔드 토큰 아님, 백엔드 미연동 시 개발용)
  return 'dummy-token-for-dev';
};
