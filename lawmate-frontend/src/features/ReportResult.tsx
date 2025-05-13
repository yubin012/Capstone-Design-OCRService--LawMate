// ✅ ReportResult.tsx - 분석 결과 조회 및 PDF 저장
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { getReportById } from '@/api/report'; // ✅ 추가
import { useLoader } from '@/contexts/LoaderContext';
import Spinner from '@/components/Spinner';

const ReportResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

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
        setContent(result || '');
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

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">분석 결과 요약</h2>
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
        <div id="pdf-content" className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
          {content}
        </div>
      ) : (
        <Spinner />
      )}

      <div className="text-right mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default ReportResult;
