// src/utils/auth.ts

// 순수 토큰 로직만 다룸
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const logout = (): void => {
  removeToken();
  window.location.href = '/login';
};

// 클라이언트에서 JWT 만료 여부까지 판단
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch {
    return false;
  }
};
