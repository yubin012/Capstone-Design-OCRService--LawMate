// src/routes/PrivateRoute.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';
import { IS_PROTECTED_MODE } from './config';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [checked, setChecked] = useState(false);
  const didConfirm = useRef(false); // ✅ confirm 중복 방지용

  useEffect(() => {
    if (!IS_PROTECTED_MODE) {
      setChecked(true);
      return;
    }

    if (!isAuthenticated()) {
      if (!didConfirm.current) {
        didConfirm.current = true;
        const confirmed = window.confirm('로그인 후 이용 가능한 서비스입니다.\n로그인 페이지로 이동하시겠습니까?');
        if (confirmed) {
          setShouldRedirect(true);
        }
      }
      setChecked(true);
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;

  if (shouldRedirect) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAuthenticated()) {
    return null;
  }

  return children;
};

export default PrivateRoute;
