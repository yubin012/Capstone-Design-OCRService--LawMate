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
      <nav className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-1.5 max-w-7xl mx-auto h-16">
        <div className="text-2xl font-bold flex-1 flex items-center h-full">
          <Link to="/" className="flex items-center space-x-2 h-full">
            <img src="/logo_lawmate.png" alt="LawMate 로고" className="h-8 w-auto" />
            <span>LawMate</span>
          </Link>
        </div>

        <ul className="hidden md:flex items-end h-full gap-0 text-base">
          <li>
            <Link
              to="/chatbot"
              className="flex items-center justify-center px-4 py-1 border-y-0 border-l border-r border-gray-300 h-full text-sm"
            >
              챗봇 상담
            </Link>
          </li>
          <li>
            <Link
              to="/upload"
              className="flex items-center justify-center px-4 py-1 border-y-0 border-l border-r border-gray-300 h-full text-sm"
            >
              법률 문서 분석
            </Link>
          </li>
          <li>
            <Link
              to="/mypage"
              className="flex items-center justify-center px-4 py-1 border-y-0 border-l border-r border-gray-300 h-full text-sm"
            >
              마이페이지
            </Link>
          </li>
          {isLoggedIn ? (
            <li className="ml-2">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-1 bg-red-600 text-white rounded text-sm h-full hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="ml-2">
              <Link
                to="/login"
                className="flex items-center justify-center px-4 py-1 bg-blue-600 text-white rounded text-sm h-full hover:bg-blue-700"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
