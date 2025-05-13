// ✅ DaumPostcodeModal.tsx
import React from 'react';
import Postcode, { Address } from 'react-daum-postcode';

interface Props {
  onComplete: (data: Address) => void;
  onClose: () => void;
}

const DaumPostcodeModal: React.FC<Props> = ({ onComplete, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[70%] max-w-xl rounded shadow overflow-hidden">
        <div className="flex justify-between items-center p-2 border-b">
          <span className="font-semibold">주소 검색</span>
          <button onClick={onClose} className="text-gray-600 hover:text-black">닫기 ✕</button>
        </div>
        <div className="h-full">
          <Postcode
            style={{ width: '100%', height: '100%' }}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default DaumPostcodeModal;
