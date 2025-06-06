import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from '@/routes';
import { LoaderProvider } from '@contexts/LoaderContext';
import Loader from '@components/common/Loader';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';

import axios from 'axios';

// ✅ 기본 axios 설정
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// ✅ 인터셉터 등록
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  try {
    const baseURL = import.meta.env.VITE_API_URL;
    const requestUrl = new URL(config.url ?? '', baseURL).pathname;

    const isPublic =
      requestUrl === '/auth/signup' || requestUrl === '/auth/login';

    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.error('⚠️ axios interceptor 오류:', e);
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
