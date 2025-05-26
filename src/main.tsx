// src/main.tsx
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './routes';
import { LoaderProvider } from '@contexts/LoaderContext';
import Loader from '@components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// ✅ axios 기본 설정
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// ✅ 인터셉터 - /auth/signup, /auth/login은 토큰 제외
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  try {
    const baseURL = import.meta.env.VITE_API_URL;
    const requestUrl = new URL(config.url ?? '', baseURL).pathname;

    const isPublicPath =
      requestUrl === '/auth/signup' || requestUrl === '/auth/login';

    if (token && !isPublicPath) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('⚠️ axios interceptor error:', e);
  }

  return config;
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('❗ root 엘리먼트를 찾을 수 없습니다.');

createRoot(rootElement).render(
  <StrictMode>
    <LoaderProvider>
      <Loader />
      <AppRouter />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </LoaderProvider>
  </StrictMode>
);
