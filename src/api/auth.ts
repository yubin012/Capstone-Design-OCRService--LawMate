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

// ✅ accessToken 반환 함수 (fallback 제거)
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// ✅ JWT 인증 헤더 생성 함수 (명확한 예외 처리 포함)
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found in localStorage');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
