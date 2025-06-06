// src/components/AnalysisPanel.tsx
import React from 'react';

interface AnalyzedClause {
  id: string;
  original: string;
  risk?: string;
  relatedCases?: string[];
}

interface AnalysisPanelProps {
  analysisText: string;
  clauses: AnalyzedClause[];
  error?: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysisText, clauses, error }) => {
  return (
    <div className="p-4 bg-blue-50 rounded shadow space-y-4 overflow-auto h-full">
      <h3 className="text-xl font-semibold mb-4">📝 분석 결과 및 주의사항</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="text-sm whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }}>
        {analysisText || '분석 결과가 없거나 챗봇 작성 요청 시 비어있음'}
      </div>

      <div className="mt-6 space-y-4">
        {clauses.length > 0 ? (
          clauses.map((clause) => (
            <div key={clause.id} className="border p-3 rounded bg-white shadow-sm">
              <p className="text-sm font-semibold mb-1">원본 조항</p>
              <p className="text-sm whitespace-pre-wrap">{clause.original}</p>
              {clause.risk && (
                <p className="mt-2 text-xs text-red-600">⚠ 위험 요소: {clause.risk}</p>
              )}
              {clause.relatedCases && clause.relatedCases.length > 0 && (
                <ul className="text-xs text-blue-600 mt-1 list-disc list-inside">
                  {clause.relatedCases.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">현재 표시할 분석 조항이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
