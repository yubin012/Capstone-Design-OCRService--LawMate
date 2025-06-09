import { AnalyzedClause } from '@/types/report_AI'; // ✅ 위험 조항 타입 import

export interface LocalSavedDoc {
  id: string;
  templateType: string;
  content: string;
  savedAt: string;
  name: string;                         // 문서 제목
  analysisSummary?: string;            // ✅ AI 분석 요약 (선택적)
  clauses?: AnalyzedClause[];          // ✅ 위험 조항 리스트 (선택적)
}

const LOCAL_STORAGE_KEY = 'localSavedReports';

// ✅ 문서 저장
export const saveLocalDoc = (
  templateType: string,
  content: string,
  name: string = '업로드한 문서',
  analysisSummary?: string,
  clauses?: AnalyzedClause[]
): void => {
  const existing = loadLocalReports();
  const newEntry: LocalSavedDoc = {
    id: `doc-${Date.now()}`,
    templateType,
    content,
    savedAt: new Date().toISOString(),
    name,
    analysisSummary, // ✅ AI 분석 요약 저장
    clauses,         // ✅ 위험 조항 리스트 저장
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...existing, newEntry]));
};

// ✅ 전체 문서 목록 불러오기
export const loadLocalReports = (): LocalSavedDoc[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LocalSavedDoc[];
  } catch (e) {
    console.error('❗ 로컬 저장 문서 로딩 실패:', e);
    return [];
  }
};

// ✅ 단일 문서 불러오기 (ID 기준)
export const getLocalDocById = (id: string): LocalSavedDoc | undefined => {
  return loadLocalReports().find((doc) => doc.id === id);
};

// ✅ 문서 삭제 (savedAt 기준)
export const deleteLocalDoc = (savedAt: string): void => {
  const filtered = loadLocalReports().filter((doc) => doc.savedAt !== savedAt);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
};

// ✅ 문서 삭제 (ID 기준)
export const deleteLocalDocById = (id: string): void => {
  const filtered = loadLocalReports().filter((doc) => doc.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
};
