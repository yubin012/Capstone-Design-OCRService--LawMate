// ✅ src/api/download.ts - 파일 다운로드 연동 API
import axios from 'axios';

/**
 * 분석 리포트 PDF 다운로드 요청
 * 서버에서 파일을 stream 형태로 반환해야 함
 */
export const downloadReportPDF = async (reportId: string): Promise<Blob> => {
  try {
    const res = await axios.get(`/api/report/${reportId}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error(`❗ PDF 다운로드 실패 (reportId: ${reportId}):`, err);
    throw new Error('PDF 파일을 다운로드하는 데 실패했습니다.');
  }
};

/**
 * 분석 리포트 결과 타입 정의
 */
export interface AnalyzedClause {
  id?: string;
  original: string;
  revised?: string;
  risk?: string;
  relatedCases?: string[];
}

export interface ReportResult {
  summary: string;
  risks: string[];
  fullText: string;
  clauses: AnalyzedClause[];
}

/**
 * 보고서 ID로 분석 결과 상세 가져오기
 * @returns 전체 분석 정보 객체 { summary, risks, fullText, clauses }
 */
export const getReportById = async (id: string): Promise<ReportResult> => {
  try {
    const res = await axios.get(`/api/report/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return res.data as ReportResult;
  } catch (error) {
    console.error(`❗ /api/report/${id} 요청 실패:`, error);
    throw new Error('분석 결과를 가져오는 데 실패했습니다.');
  }
};

/**
 * ✅ 조항 보정 내용 저장 API
 * @param reportId 분석 리포트 ID
 * @param updatedClauses 수정된 조항 배열
 */
export const saveRevisedClauses = async (
  reportId: string,
  updatedClauses: { id?: string; revised: string }[]
): Promise<void> => {
  try {
    const res = await axios.put(
      `/api/report/${reportId}/edit`,
      { clauses: updatedClauses },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (res.status !== 200) {
      throw new Error('서버가 조항 수정 저장을 정상적으로 처리하지 못했습니다.');
    }
  } catch (error) {
    console.error(`❗ 조항 수정 저장 실패 (reportId: ${reportId}):`, error);
    throw new Error('수정한 조항을 저장하는 데 실패했습니다.');
  }
};
