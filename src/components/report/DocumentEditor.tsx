// src/components/DocumentEditor.tsx
import React, { useRef } from 'react';
import { RichTextEditor } from '@mantine/rte';

interface DocumentEditorProps {
  content: string;
  onChange: (value: string) => void;
  loadingPdf: boolean;
  onDownloadPdf: () => void;
  onSave: () => Promise<void>;
}

const DocumentEditor: React.FC<DocumentEditorProps> = ({
  content,
  onChange,
  loadingPdf,
  onDownloadPdf,
  onSave,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 bg-white rounded shadow flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4">📄 문서 작성 및 수정</h3>

      <div className="flex-1 mb-4 overflow-auto" ref={editorRef}>
        <RichTextEditor
          value={content}
          onChange={onChange}
          controls={[
            'bold',
            'italic',
            'underline',
            'strike',
            'clean',
            'unorderedList',
            'orderedList',
            'blockquote',
            'code',
            'link',
            'image',
            'h1',
            'h2',
            'h3',
          ]}
          style={{ height: '70vh' }}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onSave}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          💾 저장하기
        </button>

        <button
          onClick={onDownloadPdf}
          disabled={loadingPdf}
          className={`px-5 py-2 rounded text-white ${
            loadingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {loadingPdf ? '다운로드 중...' : 'PDF 다운로드'}
        </button>
      </div>
    </div>
  );
};

export default DocumentEditor;
