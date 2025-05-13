// src/api/report.ts
import axios from 'axios';

/**
 * 보고서 ID로 서버에서 분석 결과를 가져옵니다.
 * @param id 보고서 고유 ID (예: ?id=abc123)
 * @returns 보고서 내용 (텍스트)
 */
export const getReportById = async (id: string): Promise<string> => {
  try {
    const response = await axios.get(`/api/report/${id}`);
    return response.data?.content ?? '';
  } catch (error) {
    console.error(`❗ /api/report/${id} 요청 실패:`, error);
    throw error;
  }
};
