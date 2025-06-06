// ✅ src/features/UserInfoPage.tsx - 사용자 정보 수정 및 보안 설정
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo, updateUserInfo, deleteAccount, UserInfo } from '@/api/user';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@components/common/Spinner'; // ✅ 경로 수정

const UserInfoPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const info = await getUserInfo();
        setUser(info);
        setName(info.name);
        setPhone(info.phone);
      } catch (err) {
        console.error('사용자 정보를 불러오는 데 실패했습니다:', err);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, [showLoader, hideLoader]);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    if (!name || !phone) {
      setError('이름과 전화번호는 필수입니다.');
      return;
    }
    if (password && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      showLoader();
      await updateUserInfo({ name, phone, password });
      setSuccess('회원 정보가 성공적으로 수정되었습니다.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('수정 요청 중 에러 발생:', err);
      setError('정보 수정에 실패했습니다.');
    } finally {
      hideLoader();
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      showLoader();
      await deleteAccount();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('회원 탈퇴 실패:', err);
      setError('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">회원정보 수정</h2>

      {!user ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">이메일 (수정 불가)</label>
            <input type="email" value={user.email} disabled className="w-full border p-2 rounded bg-gray-100 text-gray-600" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">전화번호</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">새 비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700">비밀번호 확인</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          <div className="flex justify-between">
            <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              수정하기
            </button>
            <button onClick={handleDeleteAccount} className="text-red-600 hover:underline text-sm">
              회원 탈퇴
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfoPage;
