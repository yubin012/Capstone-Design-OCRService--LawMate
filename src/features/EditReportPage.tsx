// ✅ src/pages/EditReportPage.tsx - 문서 조항 수정 페이지
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalyzedClause, getReportById, saveRevisedClauses } from '@/api/download';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';
import { toast } from 'react-toastify';

const EditReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [clauses, setClauses] = useState<AnalyzedClause[]>([]);
  const [reportId, setReportId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) {
      navigate('/upload');
      return;
    }
    setReportId(id);

    const fetch = async () => {
      try {
        showLoader();
        const result = await getReportById(id);
        setClauses(result.clauses || []);
      } catch (err) {
        console.error(err);
        setError('분석된 조항을 불러오는 데 실패했습니다.');
      } finally {
        hideLoader();
      }
    };
    fetch();
  }, [location.search, navigate, showLoader, hideLoader]);

  const handleChange = (index: number, value: string) => {
    setClauses((prev) =>
      prev.map((c, i) => (i === index ? { ...c, revised: value } : c))
    );
  };

  const handleSave = async () => {
    try {
      showLoader();
      const updates = clauses
        .filter((c) => c.revised && c.revised !== c.original)
        .map((c) => ({ id: c.id, revised: c.revised || '' }));

      if (updates.length === 0) {
        toast.info('수정된 내용이 없습니다.');
        return;
      }

      await saveRevisedClauses(reportId, updates);
      toast.success('수정 내용이 성공적으로 저장되었습니다.');
    } catch (err) {
        console.error('❗ 저장 실패:', err);
        toast.error('저장 중 오류가 발생했습니다.');
        } finally {
      hideLoader();
    }
  };

  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">✍️ 문서 조항 수정</h2>
      {!clauses.length ? (
        <Spinner />
      ) : (
        <div className="space-y-6">
          {clauses.map((clause, idx) => (
            <div key={idx} className="border p-4 rounded shadow-sm bg-white">
              <p className="text-sm text-gray-600 mb-1">원본 조항</p>
              <p className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{clause.original}</p>
              <textarea
                value={clause.revised || ''}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="w-full mt-2 border p-2 rounded text-sm"
                placeholder="수정된 조항 입력..."
                rows={4}
              />
              {clause.risk && (
                <p className="mt-2 text-xs text-red-600">⚠ 위험 요소: {clause.risk}</p>
              )}
              {clause.relatedCases?.length > 0 && (
                <ul className="text-xs text-blue-600 mt-1 list-disc list-inside">
                  {clause.relatedCases.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="text-right">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              💾 저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditReportPage;
