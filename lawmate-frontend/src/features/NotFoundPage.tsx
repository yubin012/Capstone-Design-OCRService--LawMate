import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="text-center mt-20 text-xl text-red-500">
      🚫 404 - 페이지를 찾을 수 없습니다. 경로를 다시 확인해주세요.
      <br />
      <Link to="/" className="text-blue-600 underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
