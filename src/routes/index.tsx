import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BaseLayout from '@/components/BaseLayout';
import MainPage from '@/features/MainPage';
import ChatbotPage from '@/features/ChatbotPage';
import UploadPage from '@/features/UploadPage';
import MyPage from '@/features/MyPage';
import LoginPage from '@/features/LoginPage';
import SignupPage from '@/features/SignupPage';
import NotFoundPage from '@/features/NotFoundPage';
import ReportResult from '@/features/ReportResult';
import { isAuthenticated } from '@/utils/auth';
import { IS_PROTECTED_MODE } from '@/routes/config';

// ✅ 조건부 인증 라우팅
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  if (!IS_PROTECTED_MODE) return element;
  return isAuthenticated() ? element : <LoginPage />;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 공통 레이아웃이 적용되는 기본 페이지들 */}
        <Route element={<BaseLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/chatbot" element={<PrivateRoute element={<ChatbotPage />} />} />
          <Route path="/upload" element={<PrivateRoute element={<UploadPage />} />} />
          <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        </Route>

        {/* ✅ 독립 페이지 (공통 레이아웃 미적용) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/result" element={<PrivateRoute element={<ReportResult />} />} />

        {/* ✅ 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
