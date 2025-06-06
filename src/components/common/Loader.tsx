import React from 'react';
import { useLoader } from '@contexts/LoaderContext';

const Loader: React.FC = () => {
  const { loading } = useLoader();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-white border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
