// ✅ Navbar.tsx - 로그인 상태 분기 + 위치 지정 + 로그아웃 처리
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '@/utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const token = getToken();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    removeToken();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 bg-white shadow z-50">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold">
          <Link to="/">LawMate</Link>
        </div>
        <ul className="hidden md:flex gap-6 text-gray-700 text-lg items-center">
          {/* 로그인 상태: 인사말 + 로그아웃 */}
          {isLoggedIn ? (
            <>
              <li className="text-sm text-gray-500">홍길동님 반갑습니다 👋</li>
              <li><Link to="/chatbot" className="hover:text-blue-600">챗봇 상담</Link></li>
              <li><Link to="/upload" className="hover:text-blue-600">법률 리스크 분석</Link></li>
              <li><Link to="/mypage" className="hover:text-blue-600">마이페이지</Link></li>
              <li>
                <button onClick={handleLogout} className="text-red-600 hover:underline">로그아웃</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-blue-600">로그인</Link></li>
              <li><Link to="/chatbot" className="hover:text-blue-600">챗봇 상담</Link></li>
              <li><Link to="/upload" className="hover:text-blue-600">법률 리스크 분석</Link></li>
              <li><Link to="/mypage" className="hover:text-blue-600">마이페이지</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
