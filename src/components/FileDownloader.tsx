// src/components/FileDownloader.tsx
import React from 'react';

interface FileDownloaderProps {
  fileUrl: string;
  filename?: string;
  label?: string;
}

const FileDownloader: React.FC<FileDownloaderProps> = ({ fileUrl, filename, label = '다운로드' }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename || fileUrl.split('/').pop() || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
    >
      {label}
    </button>
  );
};

export default FileDownloader;
