// src/features/UploadPage.tsx
import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileRejection } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '@/components/Spinner'; // ✅ 로딩 인디케이터 컴포넌트
import { toast } from 'react-toastify'; // ✅ 추가

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();



  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const selectedFile = acceptedFiles[0];
  
    // 1. fileRejections가 있을 경우 (react-dropzone 필터링에서 탈락)
    if (fileRejections.length > 0) {
      setError('지원하지 않는 파일 형식입니다. (.pdf, .doc, .docx만 가능)');
      return;
    }
  
    // 2. MIME 타입 검사 (확장자 우회 방지)
    const validMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!selectedFile || !validMimeTypes.includes(selectedFile.type)) {
      setError('파일 형식이 유효하지 않습니다. (.pdf, .doc, .docx만 가능)');
      return;
    }
  
    // 3. 크기 제한
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('10MB 이하의 파일만 업로드 가능합니다.');
      return;
    }
  
    // 통과
    setError('');
    setFile(selectedFile);
  };  

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });
  
  const handleAnalyze = async () => {
    if (!file) {
      setError('파일을 먼저 업로드해주세요.');
      toast.error('파일을 먼저 업로드해주세요.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // ⏱️ 10초 타임아웃 설정
  
      const res = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal, // 🚨 abortable
      });
  
      clearTimeout(timeoutId); // 요청 완료 시 타이머 해제
  
      toast.success('파일 업로드 및 분석 요청이 완료되었습니다.');
      navigate('/result', {
        state: {
          content: res.data.result || '결과를 받아올 수 없습니다.',
        },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_CANCELED') {
          const message = '서버 응답이 없습니다. 잠시 후 다시 시도해주세요.';
          setError(message);
          toast.error(message);
        } else {
          const message = err.response?.data?.message || '분석 요청에 실패했습니다.';
          setError(message);
          toast.error(message);
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
        toast.error('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">문서 업로드 및 분석</h2>

      {/* 드래그 앤 드롭 업로드 박스 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-10 text-center cursor-pointer mb-4 transition-all duration-300 rounded-lg ${
          isDragActive
            ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
            : 'border-gray-400 bg-white text-gray-700 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p className="text-lg font-semibold">여기에 파일을 놓아 업로드하세요 📂</p>
        ) : (
          <>
            <p className="mb-2">이 영역에 파일을 드래그하거나,</p>
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
                  onDrop([e.target.files[0]], []);
                }
              }}
            />
            <p className="text-sm mt-4 text-gray-500">
              허용 확장자: .pdf, .doc, .docx | 최대 10MB
            </p>
          </>
        )}
      </div>

      {/* 선택된 파일 정보 */}
      {file && (
        <div
          className="bg-blue-50 text-blue-800 px-4 py-2 rounded-md shadow-sm flex items-center justify-between text-sm"
          title={`파일명: ${file.name}\n크기: ${(file.size / 1024).toFixed(1)} KB\n수정일: ${new Date(file.lastModified).toLocaleString()}`}
        >
          <div className="truncate">
            📄 <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-red-500 hover:text-red-700 text-sm ml-4"
            title="삭제"
          >
            ❌
          </button>
        </div>
      )}


      {/* 에러 메시지 */}
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* 분석 버튼 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className={`px-6 py-2 rounded font-semibold transition-colors duration-200 ${
            loading || !file
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" /> 분석 중...
            </div>
          ) : (
            '업로드 및 분석'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
