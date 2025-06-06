import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-700 mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link to="/" className="text-blue-600 underline hover:text-blue-800">
        홈으로 돌아가기 →
      </Link>
    </div>
  );
}
