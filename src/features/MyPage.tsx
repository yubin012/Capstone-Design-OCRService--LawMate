import React, { useEffect, useState } from 'react';
import { getUserInfo, UserInfo } from '@/api/user';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/common/Spinner';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BookmarkItem } from '@/components/user/BookmarkList';
import ChatLogList, { ChatLogItem } from '@/components/chatbot/ChatLogList';
import FileDownloader from '@/components/report/FileDownloader';
import UploadHistoryList from '@/components/upload/UploadHistoryList';

interface Upload {
  id: string;
  filename: string;
  uploadedAt: string;
}

interface SavedReport {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  downloadUrl: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [uploadHistory, setUploadHistory] = useState<Upload[]>([]);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLogItem[]>([]);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();
        setError('');

        const info = await getUserInfo();
        setUser(info);

        // 더미 API 모드일 때 실제 API 호출은 빈 배열로 초기화
        if (IS_USE_MOCK_API) {
          setUploadHistory([]);
          setBookmarks([]);
          setChatLogs([]);
          setSavedReports([]);
        } else {
          const [uploadRes, bookmarkRes, chatLogRes, savedReportRes] = await Promise.all([
            axios.get('/api/uploads'),
            axios.get('/api/bookmarks'),
            axios.get('/api/chat-logs'),
            axios.get('/api/reports/mine'),
          ]);

          setUploadHistory(uploadRes.data);
          setBookmarks(bookmarkRes.data);
          setChatLogs(chatLogRes.data);
          setSavedReports(savedReportRes.data);
        }
      } catch (err) {
        console.error('마이페이지 데이터 불러오기 실패:', err);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
        setUser(null);
        // 각 상태 초기화
        setUploadHistory([]);
        setBookmarks([]);
        setChatLogs([]);
        setSavedReports([]);
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
          {/* 활동 요약 카드 */}
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

          {/* 최근 업로드 문서 내역 */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">📄 최근 업로드 문서</h3>
            {uploadHistory.length === 0 ? (
              <p className="text-sm text-gray-500">업로드한 문서가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadHistory.map((file) => (
                  <div
                    key={file.id}
                    className="border rounded-md p-3 bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => navigate(`/result?id=${file.id}`)}
                    >
                      <p className="text-blue-700 font-medium truncate">📎 {file.filename}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        업로드일: {new Date(file.uploadedAt).toLocaleString('ko-KR')}
                      </p>
                    </div>

                    <div className="mt-2 text-right">
                      <FileDownloader
                        fileUrl={`/api/uploads/${file.id}/download`}
                        filename={file.filename}
                        label="원본 다운로드"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 전체 업로드 문서 내역 */}
          <UploadHistoryList />

          {/* 저장된 수정 리포트 */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">📝 수정한 리포트</h3>
            {savedReports.length === 0 ? (
              <p className="text-sm text-gray-500">저장된 수정 리포트가 없습니다.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {savedReports.map((report) => (
                  <li
                    key={report.id}
                    className="flex justify-between items-center border p-3 rounded-md"
                  >
                    <div>
                      <button
                        onClick={() => navigate(`/result?id=${report.id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        📄 {report.title}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        수정일: {new Date(report.updatedAt).toLocaleString('ko-KR')}
                      </p>

                      {report.description && (
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          ✏️ {report.description}
                        </p>
                      )}
                    </div>

                    <FileDownloader
                      reportId={report.id}
                      filename={report.title + '.pdf'}
                      label="PDF 저장"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 북마크된 문서 리스트 */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">⭐ 북마크한 문서</h3>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-gray-500">북마크한 문서가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarks.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-md p-3 bg-yellow-50 hover:bg-yellow-100 transition cursor-pointer"
                    onClick={() => navigate(`/result?id=${item.id}`)}
                  >
                    <p className="text-yellow-700 font-medium truncate">📌 {item.title}</p>
                    <p className="text-xs text-gray-500 mt-1">북마크 ID: {item.id}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 챗봇 사용 내역 */}
          <ChatLogList logs={chatLogs} />

          {/* 비밀번호 변경 */}
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
