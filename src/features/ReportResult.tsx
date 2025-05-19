// ✅ ReportResult.tsx - 분석 결과 페이지 (기본 + 리스크 요약 + 강조 표시)
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { getReportById } from '@/api/report';
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';

const ReportResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [risks, setRisks] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');

    if (!id) {
      navigate('/upload');
      return;
    }

    const fetchReport = async () => {
      try {
        showLoader();
        const result = await getReportById(id);
        if (!result) {
          setError('결과가 존재하지 않습니다.');
          return;
        }

        // 예시 파싱 로직 (응답 포맷에 따라 조정 필요)
        setSummary(result.summary || '요약 없음');
        setRisks(result.risks || []);
        setContent(result.fullText || result.text || '');
      } catch (err) {
        console.error(err);
        setError('분석 결과를 불러오는 데 실패했습니다.');
      } finally {
        hideLoader();
      }
    };

    fetchReport();
  }, [location.search, navigate, showLoader, hideLoader]);

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
            <h3 className="text-lg font-semibold mb-2">📃 원문 보기</h3>
            <div
              id="pdf-content"
              ref={contentRef}
              className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: highlightRisks(content) }}
            />
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
