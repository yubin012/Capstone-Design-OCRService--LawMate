// src/components/ActivitySummary.tsx
import React from 'react';

interface ActivitySummaryProps {
  totalUploads: number;
  totalReports: number;
  totalBookmarks: number;
  lastActive: string;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  totalUploads,
  totalReports,
  totalBookmarks,
  lastActive,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded shadow-sm text-center">
        <p className="text-sm text-gray-500">업로드 문서</p>
        <p className="text-xl font-bold text-blue-600">{totalUploads}</p>
      </div>
      <div className="bg-green-50 p-4 rounded shadow-sm text-center">
        <p className="text-sm text-gray-500">생성된 리포트</p>
        <p className="text-xl font-bold text-green-600">{totalReports}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded shadow-sm text-center">
        <p className="text-sm text-gray-500">북마크</p>
        <p className="text-xl font-bold text-yellow-600">{totalBookmarks}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded shadow-sm text-center">
        <p className="text-sm text-gray-500">최근 이용일</p>
        <p className="text-sm text-gray-700 mt-1">{lastActive}</p>
      </div>
    </div>
  );
};

export default ActivitySummary;