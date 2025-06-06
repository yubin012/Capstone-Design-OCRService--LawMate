// ✅ LoginPage.tsx - 상단 홈 버튼 추가
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('❌ 로그인 실패 응답:', err.response); // 에러 응답 확인
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md relative">
      {/* 상단 로고 이미지 - 박스 내 상단에 위치, 박스 너비 기준 가운데 정렬 */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo_lawmate.png"
          alt="LawMate 로고"
          className="h-20 opacity-90"
        />
      </div>

      <Link to="/" className="absolute top-4 left-4 text-blue-600 hover:underline">
        ← 메인화면으로
      </Link>
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="이메일"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          로그인
        </button>
        <div className="text-sm text-center">
          회원이 아니신가요?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;