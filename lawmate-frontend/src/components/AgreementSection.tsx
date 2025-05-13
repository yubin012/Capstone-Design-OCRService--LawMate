// ✅ AgreementSection.tsx (최종 수정 + 텍스트 미리보기 스크롤 + 파일 구분 오류 수정)
import React, { useState } from 'react';

interface AgreementItem {
  id: string;
  label: string;
  file: string;
  optional?: boolean;
}

interface Props {
  checked: Record<string, boolean>;
  setChecked: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const agreements: AgreementItem[] = [
  {
    id: 'terms',
    label: '[필수] 이용약관',
    file: '/src/agreements/terms.txt',
  },
  {
    id: 'privacy',
    label: '[필수] 개인정보 수집 및 이용 동의서',
    file: '/src/agreements/privacy.txt',
  },
  {
    id: 'thirdparty',
    label: '[필수] 개인정보 제3자 제공 동의서',
    file: '/src/agreements/thirdparty.txt',
  },
];

const marketing: AgreementItem = {
  id: 'marketing',
  label: '[선택] 마케팅 정보 수신동의',
  file: '/src/agreements/marketing.txt',
  optional: true,
};

const AgreementSection: React.FC<Props> = ({ checked, setChecked }) => {
  const [expanded, setExpanded] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  const handleAllRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = { ...checked };
    agreements.forEach((a) => (newChecked[a.id] = e.target.checked));
    setChecked({ ...newChecked });
  };

  const handleSingle = (id: string, val: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: val }));
  };

  const loadTextFile = async (file: string, id: string) => {
    try {
      const res = await fetch(file);
      const text = await res.text();
      setPreviewContent(text);
      setActivePreviewId(id);
    } catch {
      setPreviewContent('❌ 파일을 불러오는 데 실패했습니다.');
      setActivePreviewId(id);
    }
  };

  return (
    <div className="border rounded p-3 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-semibold">
          <input
            type="checkbox"
            className="mr-2"
            checked={agreements.every((a) => checked[a.id])}
            onChange={handleAllRequired}
          />
          [필수] 이용약관 및 개인정보 수집 관련 동의, 개인정보 제3자 제공 동의
        </label>
        <button type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>
      {expanded && (
        <div className="pl-4 space-y-1">
          {agreements.map((a) => (
            <div key={a.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checked[a.id] || false}
                onChange={(e) => handleSingle(a.id, e.target.checked)}
              />
              <span>{a.label}</span>
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => loadTextFile(a.file, a.id)}
              >
                보기
              </button>
            </div>
          ))}
        </div>
      )}

      <hr className="my-2" />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={checked[marketing.id] || false}
          onChange={(e) => handleSingle(marketing.id, e.target.checked)}
        />
        <span className="font-semibold">{marketing.label}</span>
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => loadTextFile(marketing.file, marketing.id)}
        >
          보기
        </button>
      </div>

      {activePreviewId && (
        <div className="bg-gray-100 p-3 mt-3 rounded whitespace-pre-wrap text-xs border max-h-64 overflow-y-scroll">
          <strong>📄 미리보기:</strong>
          <div>{previewContent}</div>
        </div>
      )}
    </div>
  );
};

export default AgreementSection;
