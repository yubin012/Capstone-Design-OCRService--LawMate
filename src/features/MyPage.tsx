import React, { useEffect, useState } from 'react';
import { getUserInfo, UserInfo } from '@/api/user';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import BookmarkList, { BookmarkItem } from '@/components/BookmarkList';
import ChatLogList, { ChatLogItem } from '@/components/ChatLogList'; // ✅ 추가

interface Upload {
  id: string;
  filename: string;
  uploadedAt: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [uploadHistory, setUploadHistory] = useState<Upload[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogItem[]>([]); // ✅ 추가
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        const info = await getUserInfo();
        setUser(info);

        const [uploadRes, bookmarkRes, chatLogRes] = await Promise.all([
          axios.get('/api/uploads'),
          axios.get('/api/bookmarks'),
          axios.get('/api/chat-logs'), // ✅ 추가
        ]);
        setUploadHistory(uploadRes.data);
        setBookmarks(bookmarkRes.data);
        setChatLogs(chatLogRes.data);
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
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">마이페이지</h2>
        <Link to="/user-info" className="text-sm text-blue-600 hover:underline">
          ⚙️ 회원정보 수정
        </Link>
      </div>

      {!user ? (
        <Spinner />
      ) : (
        <>
          {/* 🔹 활동 요약 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">회원 이름</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-lg font-semibold">{uploadHistory.length}</p>
              <p className="text-sm text-gray-600">업로드 문서 수</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-lg font-semibold">
                {uploadHistory[0]
                  ? new Date(uploadHistory[0].uploadedAt).toLocaleDateString('ko-KR')
                  : '-'}
              </p>
              <p className="text-sm text-gray-600">최근 활동일</p>
            </div>
          </div>

          {/* 🔹 최근 업로드 문서 내역 */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">📄 최근 업로드 문서</h3>
            {uploadHistory.length === 0 ? (
              <p className="text-sm text-gray-500">업로드한 문서가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadHistory.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-md p-3 bg-gray-50 hover:bg-blue-50 transition cursor-pointer"
                    onClick={() => navigate(`/result?id=${file.id}`)}
                  >
                    <p className="text-blue-700 font-medium truncate">📎 {file.filename}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      업로드일: {new Date(file.uploadedAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ 북마크 리스트 */}
          <BookmarkList bookmarks={bookmarks} />

          {/* ✅ 챗봇 사용 내역 */}
          <ChatLogList logs={chatLogs} />

          {/* 🔹 비밀번호 변경 */}
          <div className="mt-12">
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
        </>
      )}
    </div>
  );
};

export default MyPage;
