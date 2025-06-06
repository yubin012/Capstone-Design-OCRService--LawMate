// src/features/EditReportPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalyzedClause, getReportById, saveRevisedClauses } from '@/api/report';
import { useLoader } from '@/contexts/LoaderContext';
import { toast } from 'react-toastify';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RichTextEditor } from '@mantine/rte';

const EditReportPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [clauses, setClauses] = useState<AnalyzedClause[]>([]);
  const [reportId, setReportId] = useState('');
  const [error, setError] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loading, setLoading] = useState(true);

  // PDF용 숨겨진 문서 내용 div ref
  const hiddenContentRef = useRef<HTMLDivElement>(null);

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
        setLoading(true);

        const result = await getReportById(id);

        setClauses(result.clauses || []);
        setAnalysisText(result.analysisSummary || '분석 결과가 없습니다.');

        if (!result.clauses || result.clauses.length === 0) {
          setAnalysisText('');
        }

        setEditorContent(result.documentContent || getDefaultTemplate());
        setError('');
      } catch (err) {
        console.error(err);

        // 백엔드 연결 실패 시 더미 데이터 세팅
        setClauses([
          {
            id: 'demo-1',
            original: '⚠️ 백엔드 연결 실패 - 예시 문장입니다.',
            revised: '',
            risk: '예시 위험',
            relatedCases: ['사건 예시 1', '사건 예시 2'],
          },
        ]);
        setError('⚠️ 백엔드 연결 실패: 예시 문장을 표시합니다.');
        setAnalysisText('⚠️ 백엔드 연결 실패로 인해 분석 결과가 없습니다.');
        setEditorContent(getDefaultTemplate());
      } finally {
        hideLoader();
        setLoading(false);
      }
    };
    fetch();
  }, [location.search, navigate, showLoader, hideLoader]);

  // 기본 문서 템플릿 (HTML 문자열)
  const getDefaultTemplate = (): string => `
    <h2 style="text-align:center;">내용증명서</h2>
    <p>■ 일 시:</p>
    <p>■ 수신자: (    -    )</p>
    <p>■ 주 소:</p>
    <p>■ 발신자: (    -    )</p>
    <p>■ 주 소:</p>
    <p>■ 제 목: 누락된 퇴직금지급 관련 내용증명</p>
    <p>1. 귀하(사)의 무궁한 발전을 기원합니다.</p>
    <p>2. 다음이 아니고 본인은 귀사에서 ...</p>
    <p>3. 본인은 퇴직후 지급받은 퇴직금을 확인해 본 결과 ...</p>
    <p>발신인 : (인)</p>
  `;

  const handleClauseChange = (index: number, value: string) => {
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

      // 백엔드 API saveRevisedClauses가 editorContent 필드 받도록 수정 필요
      await saveRevisedClauses(reportId, updates, editorContent);

      toast.success('수정 내용이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('❗ 저장 실패:', err);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      hideLoader();
    }
  };

  const handleDownloadPdf = async () => {
    if (!hiddenContentRef.current) return;

    setLoadingPdf(true);
    try {
      const canvas = await html2canvas(hiddenContentRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('edited_report.pdf');
    } catch (err) {
      console.error(err);
      toast.error('PDF 다운로드에 실패했습니다.');
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <>
      {loading ? (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
          style={{ minHeight: '80vh' }}
        >
          <p className="text-lg text-gray-700">로딩 중입니다... 잠시만 기다려주세요.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-12 gap-8 min-h-[80vh]">
          {/* 좌측 - 분석 결과 */}
          <div className="col-span-4 p-4 bg-blue-50 rounded shadow space-y-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-4">📝 분석 결과 및 주의사항</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="text-sm whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap' }}>
              {analysisText || '분석 결과가 없거나 챗봇 작성 요청 시 비어있음'}
            </div>
            <div className="mt-6 space-y-4">
              {clauses.length > 0 ? (
                clauses.map((clause, idx) => (
                  <div key={idx} className="border p-3 rounded bg-white shadow-sm">
                    <p className="text-sm font-semibold mb-1">원본 조항</p>
                    <p className="text-sm whitespace-pre-wrap">{clause.original}</p>
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
                ))
              ) : (
                <p className="text-gray-500 italic">현재 표시할 분석 조항이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 우측 문서 작성 및 수정 */}
          <div className="col-span-8 p-4 bg-white rounded shadow flex flex-col h-[calc(80vh-4rem)]">
            <h3 className="text-xl font-semibold mb-4 flex-shrink-0">📄 문서 작성 및 수정</h3>

            {/* 에디터 래퍼: flex-grow + overflow-auto */}
            <div className="flex-grow overflow-auto">
              <RichTextEditor
                value={editorContent}
                onChange={setEditorContent}
                controls={[
                  ['bold', 'italic', 'underline', 'strike', 'clean'],
                  ['unorderedList', 'orderedList'],
                  ['blockquote', 'code', 'link', 'image'],
                  ['h1', 'h2', 'h3'],
                ]}
                style={{ height: '70vh' }}
              />
            </div>

            {/* 버튼 그룹: flex-shrink-0 */}
            <div className="flex justify-end space-x-3 mt-4 flex-shrink-0">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                💾 저장하기
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={loadingPdf}
                className={`px-5 py-2 rounded text-white ${
                  loadingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {loadingPdf ? '다운로드 중...' : 'PDF 다운로드'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PDF 다운로드용 숨겨진 문서 내용 (에디터 UI 없이) */}
      <div
        ref={hiddenContentRef}
        className="max-w-7xl mx-auto p-8 bg-white text-black"
        style={{ position: 'fixed', top: -9999, left: -9999, width: '800px', zIndex: -1 }}
        dangerouslySetInnerHTML={{ __html: editorContent }}
      />
    </>
  );
};

export default EditReportPage;
