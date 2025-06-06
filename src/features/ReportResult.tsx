import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { getReportById, saveReportMeta, saveRevisedClauses } from '@/api/report';
import { useLoader } from '@/contexts/LoaderContext';
import BookmarkToggleButton from '@components/report/BookmarkToggleButton';
import 'react-quill/dist/quill.snow.css';

// ✅ ReactQuill lazy import for Vite compatibility
const ReactQuill = lazy(() => import('react-quill'));

interface AnalyzedClause {
  id: string;
  original: string;
  revised?: string;
  risk?: string;
  relatedCases?: string[];
}

const ReportResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [risks, setRisks] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);
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
        setTitle(result.title || '');
        setDescription(result.description || '');
      } catch (err) {
        console.error('API 호출 실패:', err);

        // ✅ 화면을 렌더링할 수 있도록 더미 데이터 세팅
        setSummary('⚠️ 백엔드 연결 실패: 더미 리포트를 표시합니다.');
        setRisks(['위험 요소 예시']);
        setContent('이 문장은 테스트 콘텐츠입니다. 백엔드 없이도 UI를 확인할 수 있습니다.');
        setClauses([{
          id: 'dummy',
          original: '이 조항은 테스트용 샘플입니다.',
          revised: '',
          risk: '계약 조건 누락',
          relatedCases: ['대법원 2019다12345']
        }]);
        setTitle('백엔드 미연결 샘플 제목');
        setDescription('이 리포트는 네트워크 오류 상황에서도 화면을 테스트할 수 있게 해줍니다.');
        setError('⚠️ 백엔드 연결 실패: 더미 데이터를 기반으로 렌더링 중입니다.');
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
      highlighted = highlighted.replace(
        regex,
        `<mark data-risk="${risk}" class="bg-red-100 text-red-700 px-1 rounded">$1</mark>`
      );
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
        <div className="flex gap-2">
          {reportId && (
            <BookmarkToggleButton
              reportId={reportId}
              title={summary.slice(0, 20) || '제목 없음'}
            />
          )}
          <button
            onClick={handleDownloadPDF}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            PDF 다운로드
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">📝 리포트 제목</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 mb-3 text-sm"
          placeholder="예: 계약서 위험 분석 보고서"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block text-sm font-semibold mb-1">📌 리포트 설명</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="문서의 목적, 분석 배경 등을 입력하세요"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="text-right mt-2">
          <button
            disabled={savingMeta}
            onClick={async () => {
              if (!reportId) return;
              setSavingMeta(true);
              try {
                await saveReportMeta(reportId, { title, description });
                alert('리포트 제목과 설명이 저장되었습니다.');
              } catch (err) {
                console.error(err);
                alert('저장 중 오류가 발생했습니다.');
              } finally {
                setSavingMeta(false);
              }
            }}
            className={`px-4 py-2 rounded text-white text-sm ${savingMeta ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {savingMeta ? '저장 중...' : '제목/설명 저장'}
          </button>
        </div>
      </div>

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
            {(clauses.length > 0 ? clauses : [{
              id: 'fallback',
              original: content,
              revised: '',
              risk: '',
              relatedCases: []
            }]).map((clause, idx) => (
              <div key={idx} className="bg-white border rounded-md p-4 text-sm shadow-sm">
                <p
                  className="mb-1 text-gray-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: `<strong>원문:</strong> ${highlightRisks(clause.original)}` }}
                />
                <div className="mt-2">
                  <label className="block text-xs text-gray-500 mb-1">✏️ 보정 (수정 가능)</label>
                  <Suspense fallback={<div className="text-gray-400">로딩 중...</div>}>
                    <ReactQuill
                      theme="snow"
                      value={clause.revised || ''}
                      onChange={(value) => handleClauseChange(idx, value)}
                      className="bg-white"
                    />
                  </Suspense>
                </div>
                {clause.risk && (
                  <p className="mb-1 mt-2 text-red-600 whitespace-pre-wrap">
                    <strong>위험도:</strong> {clause.risk}
                  </p>
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
            ))}
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

      {error && (
        <div className="text-center text-red-500 my-4">{error}</div>
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
