import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BaseLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl px-4 py-6 mx-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
