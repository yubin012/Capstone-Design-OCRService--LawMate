// src/routes/index.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BaseLayout from '@components/common/BaseLayout';
import MainPage from '@features/MainPage';
import ChatbotPage from '@features/ChatbotPage';
import UploadPage from '@features/UploadPage';
import MyPage from '@features/MyPage';
import LoginPage from '@features/LoginPage';
import SignupPage from '@features/SignupPage';
import NotFoundPage from '@features/NotFoundPage';
import ReportResult from '@features/ReportResult';
import EditReportPage from '@features/EditReportPage';
import UserInfoPage from '@features/UserInfoPage';

import { IS_PROTECTED_MODE } from '@/routes/config';
import { isAuthenticated } from '@/utils/auth';

/** 보호된 라우트 */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = isAuthenticated();
  if (!IS_PROTECTED_MODE) return children;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<BaseLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/chatbot" element={<PrivateRoute><ChatbotPage /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />

        {/* 분석 결과, 리포트 수정, 사용자 정보 등도 보호된 라우트로 처리 */}
        <Route path="/result" element={<PrivateRoute><ReportResult /></PrivateRoute>} />
        <Route path="/edit" element={<PrivateRoute><EditReportPage /></PrivateRoute>} />
        <Route path="/userinfo" element={<PrivateRoute><UserInfoPage /></PrivateRoute>} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
