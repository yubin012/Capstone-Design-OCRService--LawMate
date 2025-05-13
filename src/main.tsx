// src/main.tsx
import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './routes';
import { LoaderProvider } from '@contexts/LoaderContext';
import Loader from '@components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('❗ root 엘리먼트를 찾을 수 없습니다.');

createRoot(rootElement).render(
  <StrictMode>
    <LoaderProvider>
      <Loader />
      <AppRouter />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar /> {/* ✅ 토스트 추가 */}
    </LoaderProvider>
  </StrictMode>
);
