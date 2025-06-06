// src/components/DocumentHistoryList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export interface DocumentItem {
  id: string;
  filename: string;
  uploadedAt: string;
}

interface DocumentHistoryListProps {
  documents: DocumentItem[];
}

const DocumentHistoryList: React.FC<DocumentHistoryListProps> = ({ documents }) => {
  const navigate = useNavigate();

  const handleDownload = async (docId: string, filename: string) => {
    try {
      const res = await axios.get(`/api/download/${docId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // 저장될 파일 이름
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('파일 다운로드 실패', err);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center py-4">
        업로드한 문서가 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">📄 문서 분석 내역</h3>
      <ul className="divide-y divide-gray-200 text-sm">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="py-3 px-2 hover:bg-gray-50 rounded transition flex justify-between items-center"
          >
            <div
              className="cursor-pointer"
              onClick={() => navigate(`/result?id=${doc.id}`)}
            >
              <span className="font-medium text-blue-600">{doc.filename}</span>
              <span className="text-gray-500 text-xs ml-2">
                ({new Date(doc.uploadedAt).toLocaleString('ko-KR')})
              </span>
            </div>
            <button
              onClick={() => handleDownload(doc.id, doc.filename)}
              className="text-sm text-green-600 hover:underline"
            >
              ⬇️ 다운로드
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentHistoryList;
