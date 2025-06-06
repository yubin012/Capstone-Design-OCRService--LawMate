// src/components/UploadHistoryList.tsx
import React, { useEffect, useState } from 'react';
import { getUploadHistory, UploadHistoryItem } from '@/api/upload';
import { useNavigate } from 'react-router-dom';
import FileDownloader from '@/components/report/FileDownloader';

const UploadHistoryList: React.FC = () => {
  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getUploadHistory();
        setHistory(data);
      } catch (err) {
        console.error('❗ 업로드 내역 불러오기 실패:', err);
        setError('업로드 내역을 불러올 수 없습니다.');
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">📤 업로드된 문서</h3>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-600 text-sm">업로드된 문서가 없습니다.</p>
      ) : (
        <ul className="text-sm space-y-2">
          {history.map((item) => (
            <li
              key={item.id}
              className="border rounded px-4 py-3 bg-gray-50 hover:bg-blue-50 shadow-sm flex justify-between items-center"
            >
              {/* 제목 클릭 시 결과 페이지로 이동 */}
              <div
                className="cursor-pointer text-blue-700 font-medium truncate"
                onClick={() => navigate(`/result?id=${item.id}`)}
              >
                📄 {item.filename}
                <div className="text-xs text-gray-500">
                  업로드일: {new Date(item.uploadedAt).toLocaleString('ko-KR')}
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <FileDownloader
                reportId={item.id.toString()}
                filename={item.filename}
                label="원본 다운로드"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UploadHistoryList;
