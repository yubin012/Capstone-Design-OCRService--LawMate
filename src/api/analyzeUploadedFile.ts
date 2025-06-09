import axios from 'axios';
import { AnalyzedClause } from '@/types/report'; // 필요 시 수정

export interface AnalyzeResult {
  ocrHtml: string;
  analysisSummary: string;
  clauses: AnalyzedClause[];
}

// 📊 분석 결과 요청 (fileId → 분석 결과 JSON 반환)
export const analyzeUploadedFile = async (fileId: string): Promise<AnalyzeResult> => {
  const res = await axios.get(`/api/analyze/${fileId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  return res.data; // { ocrHtml, analysisSummary, clauses }
};
