// ✅ src/routes/PrivateRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { IS_PROTECTED_MODE } from '@/routes/config';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();

  if (!IS_PROTECTED_MODE) return children;

  if (!isLoggedIn) {
    alert('로그인 후 이용 가능한 서비스입니다.');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
