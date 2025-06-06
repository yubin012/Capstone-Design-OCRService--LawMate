import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <main className="w-full min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
        
        {/* === 배경 이미지 레이어 === */}
        <img src="/main_back1.png" alt="배경1" className="absolute top-0 left-0 w-[300px] opacity-30 z-0 pointer-events-none" />
        <img src="/main_back2.png" alt="배경2" className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[400px] opacity-30 z-0 pointer-events-none" />
        <img src="/main_back3.png" alt="배경3" className="absolute bottom-0 right-0 w-[350px] opacity-30 z-0 pointer-events-none" />

        {/* Text Content */}
        <div className="flex-1 space-y-4 relative z-10">
          <h1 className="text-2xl md:text-4xl font-bold">
            복잡한 법적 고민? <br />
            <span className="text-indigo-600">LawMate</span>랑 해결해요!
          </h1>
          <p className="text-gray-600 text-base">
            AI 법률 상담과 문서 위험 분석을 통해<br />
            쉽고 빠르게 법적 문제를 해결할 수 있습니다.
          </p>

          {/* 설명 카드 블럭 */}
          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            {/* 상담 카드 */}
            <div className="flex-1 bg-rose-300 text-white p-5 rounded-lg shadow-lg relative min-h-[220px]">
              <h3 className="text-base font-bold leading-snug mb-2">
                <span className="text-red-500">법적 문제</span>,<br />어디서부터 시작해야 할지 막막하신가요?
              </h3>
              <p className="text-[11px] text-white mb-4 pr-6">
                상황을 간단히 입력하면, AI가 필요한 문서와 대응 방법을 찾아드려요.
              </p>
              <Link
                to="/chatbot"
                className="absolute bottom-4 right-4 inline-flex items-center bg-teal-200 text-black px-3 py-2 rounded-md font-semibold shadow hover:bg-teal-300 text-sm"
              >
                <img src="/main_ex_img1.png" alt="챗봇 아이콘" className="w-4 h-4 mr-2" />
                상담 시작하기
              </Link>
              <div className="absolute top-[-10px] right-[-10px] w-10 h-10 bg-rose-400 rounded-full shadow-lg" />
            </div>

            {/* 분석 카드 */}
            <div className="flex-1 bg-indigo-100 text-gray-900 p-5 rounded-lg shadow-lg relative min-h-[220px]">
              <h3 className="text-base font-bold leading-snug mb-2">
                내가 작성한 <span className="text-indigo-600">법률문서</span>,<br />안전할까요?
              </h3>
              <p className="text-[11px] text-gray-800 mb-5 pr-6">
                작성하신 계약서나 고소장 업로드 시, AI가 리스크를 분석하고 보완점을 안내해드립니다.
              </p>
              <Link
                to="/upload"
                className="absolute bottom-4 right-4 inline-flex items-center bg-pink-300 text-white px-3 py-2 rounded-md font-semibold shadow hover:bg-pink-400 text-sm"
              >
                <img src="/main_ex_img2.png" alt="분석 아이콘" className="w-4 h-4 mr-2" />
                분석 시작하기
              </Link>
              <div className="absolute top-[-10px] left-[-10px] w-10 h-10 bg-indigo-300 rounded-full shadow-lg" />
            </div>
          </div>
        </div>

        {/* 오른쪽 일러스트 + 배경 박스 */}
        <div className="flex-1 relative z-10">
          <div className="absolute top-0 right-0 w-[260px] h-full bg-rose-400 rounded-tl-3xl rounded-bl-3xl md:rounded-br-none z-0" />
          <div className="relative z-10 w-full max-w-sm mx-auto">
            <img
              src="/law_illustration.png"
              alt="법 이미지"
              className="w-[280px] h-auto mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Section 2: 서비스 소개 */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-10">
          우리는 <span className="text-rose-500">이런 서비스</span>를 제공해요!
        </h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              title: 'AI 법률 챗봇 상담',
              desc: 'LawMate와 함께 신속하게 법적 문제를 해결하세요. 법적 조언을 받으면서, 무엇을 해야할지 명확히 알 수 있습니다.',
              icon: '/main_ex_img1.png',
            },
            {
              title: '법률 문서 자동 작성',
              desc: '챗봇 상담을 바탕으로 쉽고 빠르게 법률 문서 템플릿을 자동으로 작성해드립니다.',
              icon: '/main_ex_img2.png',
            },
            {
              title: '법률 리스크 분석',
              desc: '업로드된 문서를 리스크 분석을 통해 불리한 조항이나 누락된 부분을 찾아내고, 수정 가이드를 제공합니다.',
              icon: '/main_ex_img3.png',
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <img src={icon} alt={title} className="w-[90px] h-[90px] mx-auto mb-4" />
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-gray-600 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: 차별점 소개 */}
      <section className="py-20 px-6 bg-white text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold">
              <span className="text-indigo-600">LawMate</span>만의 차별점은 무엇인가요?
            </h2>
            <p className="text-base font-semibold">
              문서만 올리세요! <span className="text-indigo-600 font-bold">LawMate</span>가 법적 리스크를 찾아드립니다.
            </p>
            <div className="text-gray-600 text-[11.5px] leading-relaxed space-y-2">
              <p>
                <strong>국내 최초, 문서 OCR 기반 리스크 자동 분석</strong><br />
                대부분의 AI 법률 서비스가 상담이나 문서 작성 지원에 머무르는 가운데, 
                <span className="text-indigo-600 font-bold">LawMate</span>는 한 걸음 더 나아갑니다.
              </p>
              <p>
                작성하신 문서를 업로드만 해주세요!<br />
                저희는 업로드한 문서를 OCR로 분석하고, 숨겨진 법적 리스크까지 자동으로 진단해드립니다.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1">
            <img
              src="/dashboard_mockup.png"
              alt="대시보드"
              className="w-[400px] h-auto mx-auto"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
