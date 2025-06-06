// src/api/report.ts
import axios from 'axios';
import { getToken } from '@/utils/auth';
import { IS_USE_MOCK_API } from '@/routes/config';

// 인증 헤더 설정
const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// 분석 리포트 상세 타입
export interface ReportDetail {
  id: string;
  title?: string;
  description?: string;
  summary: string;
  fullText: string;
  clauses: {
    id: string;
    original: string;
    revised?: string;
    risk?: string;
    relatedCases?: string[];
  }[];
  risks: string[];
}

// 더미 데이터 (mock)
const MOCK_REPORT: ReportDetail = {
  id: 'mock-1',
  title: '더미 리포트 제목',
  description: '더미 리포트 설명입니다.',
  summary: '⚠️ 더미 분석 결과 - 실제 API가 연결되지 않았습니다.',
  fullText: '이 문장은 테스트용 더미 문서 내용입니다.',
  clauses: [
    {
      id: 'mock-1-1',
      original: '⚠️ 더미 문서 조항 예시입니다.',
      revised: '',
      risk: '더미 위험 요소',
      relatedCases: ['더미 판례 1', '더미 판례 2'],
    },
  ],
  risks: ['더미 위험 요소 예시'],
};

// 분석 결과 조회
export const getReportById = async (id: string): Promise<ReportDetail> => {
  if (IS_USE_MOCK_API) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_REPORT), 500); // 약간 지연 후 반환 (테스트 용)
    });
  }

  try {
    const response = await axios.get(`/api/report/${id}`, { headers: headers() });
    return response.data;
  } catch (error) {
    console.error(`❗ /api/report/${id} 요청 실패:`, error);
    throw error;
  }
};

// 메타데이터 저장 (제목 + 설명)
export const saveReportMeta = async (
  id: string,
  meta: { title: string; description: string }
) => {
  if (IS_USE_MOCK_API) {
    return Promise.resolve(); // 더미 모드에서는 저장 안 함
  }
  try {
    await axios.put(`/api/report/${id}/meta`, meta, { headers: headers() });
  } catch (error) {
    console.error(`❗ /api/report/${id}/meta 저장 실패:`, error);
    throw error;
  }
};

// 수정된 조항 저장
export const saveRevisedClauses = async (
  reportId: string,
  clauses: { id: string; revised: string }[]
) => {
  if (IS_USE_MOCK_API) {
    return Promise.resolve(); // 더미 모드에서는 저장 안 함
  }
  try {
    await axios.put(`/api/report/${reportId}/clauses`, { clauses }, { headers: headers() });
  } catch (error) {
    console.error(`❗ /api/report/${reportId}/clauses 저장 실패:`, error);
    throw error;
  }
};
