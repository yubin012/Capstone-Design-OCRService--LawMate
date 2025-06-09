import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoader } from '@/contexts/LoaderContext';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import { RichTextEditor } from '@mantine/rte';
import { fillTemplateFromResponse } from '@/utils/fillTemplate';
import { saveLocalDoc } from '@/utils/localSavedDocs';
import { AnalyzedClause } from '@/types/report_AI'; // ✅ 수정된 타입 경로
import { getReportById } from '@/api/report';

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

  const state = location.state as {
    templateType?: string;
    variables?: Record<string, string>;
    content?: string;
    analysisSummary?: string;
    clauses?: AnalyzedClause[];
  } | null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        setEditorContent(prev => prev + '<div style="page-break-after: always;"></div>');
        toast.info('📄 페이지 구분이 추가되었습니다.');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const dataParam = params.get('data');
    const shouldUseState = !!state?.templateType && (!!state?.variables || !!state?.content);

    if (!id && !shouldUseState) {
      navigate('/upload');
      return;
    }
    if (id) setReportId(id);

    const fetch = async () => {
      try {
        showLoader();
        setLoading(true);

        if (state?.templateType && state?.variables) {
          const filled = fillTemplateFromResponse({ template: state.templateType, variables: state.variables });
          if (filled) {
            setEditorContent(filled);
            setClauses([]);
            setAnalysisText('');
            return;
          }
        }

        if (state?.templateType && state?.content) {
          setEditorContent(state.content);
          setClauses(state.clauses ?? []);
          setAnalysisText(state.analysisSummary ?? '');
          return;
        }

        const result = await getReportById(id!);
        setClauses(result.clauses ?? []);
        setAnalysisText(result.analysisSummary ?? '');
        if (result.documentContent) {
          setEditorContent(result.documentContent);
        } else if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam));
          const filled = fillTemplateFromResponse(parsed);
          setEditorContent(filled ?? getDefaultTemplate());
        } else {
          setEditorContent(getDefaultTemplate());
        }
      } catch (err) {
        console.error(err);
        setClauses([{
          original: '⚠️ 백엔드 연결 실패 - 예시 문장입니다.',
          revised: '',
          risk: '예시 위험',
        }]);
        setAnalysisText('⚠️ 백엔드 연결 실패로 인해 분석 결과가 없습니다.');
        setEditorContent(getDefaultTemplate());
        setError('⚠️ 백엔드 연결 실패: 예시 문장을 표시합니다.');
      } finally {
        hideLoader();
        setLoading(false);
      }
    };
    fetch();
  }, [location.search, location.state]);

  const getDefaultTemplate = () => `
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

  const handleSave = () => {
  try {
    if (state?.templateType) {
      saveLocalDoc(
        state.templateType,     // 템플릿 종류 (e.g. OCR_ANALYZED)
        editorContent,          // WYSIWYG 에디터 내용 (HTML)
        '업로드한 문서',         // 문서 이름
        analysisText,           // ✅ 분석 요약
        clauses                 // ✅ 위험 조항 리스트
      );
      toast.success('📁 로컬에 문서가 저장되었습니다.');
    } else {
      toast.info('⚠️ 템플릿 정보가 없어 로컬 저장이 생략되었습니다.');
    }
  } catch (err) {
    console.error('❗ 로컬 저장 실패:', err);
    toast.error('로컬 저장 중 오류가 발생했습니다.');
  }
};


  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = editorContent;
      Object.assign(tempDiv.style, {
        width: '800px',
        padding: '30px',
        backgroundColor: 'white',
        color: 'black',
        fontSize: '12pt',
        fontFamily: '맑은 고딕, Malgun Gothic, sans-serif',
        lineHeight: '1.6',
      });
      document.body.appendChild(tempDiv);

      await html2pdf().set({
        margin: 1,
        filename: 'edited_report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(tempDiv).save();

      document.body.removeChild(tempDiv);
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
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50" style={{ minHeight: '80vh' }}>
          <p className="text-lg text-gray-700">로딩 중입니다... 잠시만 기다려주세요.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-12 gap-8 min-h-[80vh]">
          {/* 좌측: 분석 요약 및 조항 */}
          <div className="col-span-4 p-4 bg-blue-50 rounded shadow space-y-4 overflow-auto">
            <h3 className="text-xl font-semibold mb-4">📝 분석 결과 및 주의사항</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="text-sm whitespace-pre-wrap">{analysisText}</div>
            <div className="mt-6 space-y-4">
              {clauses.length > 0 ? clauses.map((clause, idx) => (
                <div key={idx} className="border p-3 rounded bg-white shadow-sm">
                  <p className="text-sm font-semibold mb-1">원본 조항</p>
                  <p className="text-sm whitespace-pre-wrap">{clause.original}</p>
                  {clause.risk && <p className="mt-2 text-xs text-red-600">⚠ 위험 요소: {clause.risk}</p>}
                </div>
              )) : (
                <p className="text-gray-500 italic">현재 표시할 분석 조항이 없습니다.</p>
              )}
            </div>
          </div>

          {/* 우측: 에디터 */}
          <div className="col-span-8 p-4 bg-white rounded shadow flex flex-col h-[calc(80vh-4rem)]">
            <h3 className="text-xl font-semibold mb-4 flex-shrink-0">📄 문서 작성 및 수정</h3>
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
            <div className="flex justify-end space-x-3 mt-4 flex-shrink-0">
              <button onClick={handleSave} className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700">
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
    </>
  );
};

export default EditReportPage;
