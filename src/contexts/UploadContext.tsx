// src/contexts/UploadContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UploadContextType {
  file: File | null;
  setFile: (file: File | null) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <UploadContext.Provider value={{ file, setFile }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) throw new Error('UploadContext not found');
  return context;
};
