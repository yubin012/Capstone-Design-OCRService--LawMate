// src/components/FileUploadBox.tsx
import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onFileSelected: (file: File) => void;
}

const FileUploadBox: React.FC<Props> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelected(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-400 p-10 text-center cursor-pointer mb-4"
    >
      <input {...getInputProps()} />
      <p className="mb-2">업로드하려면 파일을 이 영역에 드래그하거나</p>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 border rounded bg-white hover:bg-gray-50"
      >
        파일을 선택하세요
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
          }
        }}
      />
      <p className="text-sm mt-4 text-gray-500">
        최대 업로드 크기: 10MB (.pdf, .doc, .docx)
      </p>
    </div>
  );
};

export default FileUploadBox;
