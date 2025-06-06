// src/components/DebugNavbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const DebugNavbar = () => {
  const isDebug = import.meta.env.VITE_DEBUG_MODE === 'true';
  if (!isDebug) return null;

  return (
    <div className="bg-yellow-100 text-sm px-4 py-2 flex flex-wrap gap-4 justify-center border-b border-yellow-300">
      <span className="font-semibold text-yellow-700">🛠 디버그 네비게이션:</span>
      
      {/* 기본 페이지 */}
      <Link to="/" className="text-blue-700 hover:underline">메인</Link>
      <Link to="/signup" className="text-blue-700 hover:underline">회원가입</Link>
      <Link to="/login" className="text-blue-700 hover:underline">로그인</Link>
      
      {/* 기능 페이지 */}
      <Link to="/chatbot" className="text-blue-700 hover:underline">챗봇 상담</Link>
      <Link to="/upload" className="text-blue-700 hover:underline">문서 업로드</Link>
      <Link to="/result?id=demo" className="text-blue-700 hover:underline">분석 결과 (X)</Link>
      <Link to="/edit?id=demo" className="text-blue-700 hover:underline">리포트 수정 (예시)</Link>
      <Link to="/mypage" className="text-blue-700 hover:underline">마이페이지</Link>
      <Link to="/userinfo" className="text-blue-700 hover:underline">회원 정보</Link>
      
      {/* 추가 테스트용 페이지 */}
      <Link to="/404" className="text-blue-700 hover:underline">404 테스트</Link>
      <Link to="/debug" className="text-blue-700 hover:underline">디버그 페이지</Link>
      <Link to="/test" className="text-blue-700 hover:underline">테스트 페이지</Link>
      <Link to="/dummy" className="text-blue-700 hover:underline">더미 데이터 페이지</Link>
      <Link to="/mock" className="text-blue-700 hover:underline">모킹 페이지</Link>
    </div>
  );
};

export default DebugNavbar;
