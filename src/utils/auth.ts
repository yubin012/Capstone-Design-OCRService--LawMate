// src/utils/auth.ts

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

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
