import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { getReportById, AnalyzedClause, saveRevisedClauses } from '@/api/download';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';

const ReportResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [risks, setRisks] = useState<string[]>([]);
  const [clauses, setClauses] = useState<AnalyzedClause[]>([]);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [saving, setSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(location.search);
  const reportId = params.get('id');

  useEffect(() => {
    if (!reportId) {
      navigate('/upload');
      return;
    }

    const fetchReport = async () => {
      try {
        showLoader();
        const result = await getReportById(reportId);
        if (!result) {
          setError('결과가 존재하지 않습니다.');
          return;
        }
        setSummary(result.summary || '요약 없음');
        setRisks(result.risks || []);
        setContent(result.fullText || '');
        setClauses(result.clauses || []);
      } catch (err) {
        console.error(err);
        setError('분석 결과를 불러오는 데 실패했습니다.');
      } finally {
        hideLoader();
      }
    };

    fetchReport();
  }, [reportId, navigate, showLoader, hideLoader]);

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-content');
    if (element) {
      html2pdf()
        .set({
          margin: 0.5,
          filename: `LawMate_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();
    }
  };

  const scrollToRisk = (phrase: string) => {
    const element = document.querySelector(`[data-risk="${phrase}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const highlightRisks = (text: string) => {
    let highlighted = text;
    risks.forEach((risk) => {
      const escaped = risk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      highlighted = highlighted.replace(regex, `<mark data-risk="${risk}" class="bg-red-100 text-red-700 px-1 rounded">$1</mark>`);
    });
    return highlighted;
  };

  const handleClauseChange = (idx: number, revisedText: string) => {
    const updated = [...clauses];
    updated[idx] = { ...updated[idx], revised: revisedText };
    setClauses(updated);
  };

  const handleSave = async () => {
    if (!reportId) return;
    setSaving(true);
    try {
      const updates = clauses
        .filter((c) => c.revised && c.revised !== c.original)
        .map((c) => ({ id: c.id, revised: c.revised! }));

      await saveRevisedClauses(reportId, updates);
      alert('수정된 조항이 저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">📄 분석 결과</h2>
        <button
          onClick={handleDownloadPDF}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          PDF 다운로드
        </button>
      </div>

      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : content ? (
        <>
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">🧾 요약</h3>
            <p className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">{summary}</p>
          </section>

          {risks.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">⚠️ 위험 요소</h3>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowDetails((prev) => !prev)}
                >
                  {showDetails ? '숨기기' : '펼치기'}
                </button>
              </div>
              {showDetails && (
                <ul className="mt-2 space-y-1 text-sm">
                  {risks.map((risk, idx) => (
                    <li key={idx}>
                      <button
                        onClick={() => scrollToRisk(risk)}
                        className="text-red-600 hover:underline"
                      >
                        🔸 {risk}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section>
            <h3 className="text-lg font-semibold mb-2">📃 문서 원문 + 분석</h3>
            <div id="pdf-content" ref={contentRef} className="space-y-4">
              {clauses.length > 0 ? (
                clauses.map((clause, idx) => (
                  <div key={idx} className="bg-white border rounded-md p-4 text-sm shadow-sm">
                    <p
                      className="mb-1 text-gray-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: `<strong>원문:</strong> ${highlightRisks(clause.original)}` }}
                    />
                    <div className="mt-2">
                      <label className="block text-xs text-gray-500 mb-1">✏️ 보정 (수정 가능)</label>
                      <textarea
                        value={clause.revised || ''}
                        onChange={(e) => handleClauseChange(idx, e.target.value)}
                        className="w-full p-2 border rounded text-sm resize-y"
                        rows={2}
                      />
                    </div>
                    {clause.risk && (
                      <p className="mb-1 mt-2 text-red-600 whitespace-pre-wrap"><strong>위험도:</strong> {clause.risk}</p>
                    )}
                    {clause.relatedCases && clause.relatedCases.length > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        <strong>관련 판례:</strong>
                        <ul className="list-disc list-inside">
                          {clause.relatedCases.map((caseItem, caseIdx) => (
                            <li key={caseIdx}>{caseItem}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div
                  className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightRisks(content) }}
                />
              )}
            </div>

            {clauses.length > 0 && (
              <div className="text-right mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-5 py-2 rounded text-white text-sm ${saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {saving ? '저장 중...' : '수정 내용 저장하기'}
                </button>
              </div>
            )}
          </section>
        </>
      ) : (
        <Spinner />
      )}

      <div className="text-right mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          ← 이전으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default ReportResult;
