import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div>© 2025 LawMate Inc.</div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">이용약관</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
