// ✅ src/features/MyPage.tsx (비밀번호 변경 + 최근 업로드 문서 클릭 이동 포함)
import React, { useEffect, useState } from 'react';
import { getUserInfo, UserInfo } from '@/api/user';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Upload {
  id: string;
  filename: string;
  uploadedAt: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadHistory, setUploadHistory] = useState<Upload[]>([]);
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const info = await getUserInfo();
        setUser(info);

        const uploadRes = await axios.get('/api/uploads');
        setUploadHistory(uploadRes.data);
      } catch (err) {
        console.error(err);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      } finally {
        hideLoader();
      }
    };
    fetchData();
  }, [showLoader, hideLoader]);

  const handleChangePassword = async () => {
    setError('');
    setSuccessMsg('');
    if (!password || password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    try {
      showLoader();
      await axios.post('/api/change-password', { password });
      setSuccessMsg('비밀번호가 성공적으로 변경되었습니다.');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('비밀번호 변경에 실패했습니다.');
    } finally {
      hideLoader();
    }
  };

  if (error && !user) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">마이페이지</h2>

      {!user ? (
        <Spinner />
      ) : (
        <>
          <ul className="text-lg space-y-2 mb-6">
            <li><strong>이름:</strong> {user.name}</li>
            <li><strong>이메일:</strong> {user.email}</li>
            <li><strong>가입일:</strong> {new Date(user.joinedAt).toLocaleDateString('ko-KR')}</li>
          </ul>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">비밀번호 변경</h3>
            <input
              type="password"
              placeholder="새 비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full rounded mb-2"
            />
            <button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              변경하기
            </button>
            {successMsg && <p className="text-green-600 text-sm mt-2">{successMsg}</p>}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {uploadHistory.length > 0 && (
            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-2">최근 업로드한 문서</h3>
              <ul className="space-y-1">
                {uploadHistory.map((file) => (
                  <li
                    key={file.id}
                    className="cursor-pointer text-blue-600 hover:underline text-sm"
                    onClick={() => navigate(`/result?id=${file.id}`)}
                  >
                    📄 {file.filename} ({new Date(file.uploadedAt).toLocaleString('ko-KR')})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPage;
