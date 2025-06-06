import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import DebugNavbar from '@/components/common/DebugNavbar';

import { IS_DEBUG_NAVBAR_ENABLED } from '@/routes/config';

const BaseLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      {IS_DEBUG_NAVBAR_ENABLED && <DebugNavbar />} {/* 설정에 따라 렌더링 */}
      <Navbar />
      <main className="flex-1 w-full max-w-6xl px-4 py-6 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
