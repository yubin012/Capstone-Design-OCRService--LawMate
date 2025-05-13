import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">AI로 당신의 계약을 안전하게 분석하세요</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/chatbot" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">챗봇 상담 시작하기</Link>
        <Link to="/upload" className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-900">문서 업로드하러 가기</Link>
      </div>
    </div>
  );
};
export default MainPage;