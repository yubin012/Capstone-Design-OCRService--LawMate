import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // 세부 컴포넌트 디렉토리
      { find: '@components/chatbot', replacement: path.resolve(__dirname, 'src/components/chatbot') },
      { find: '@components/common', replacement: path.resolve(__dirname, 'src/components/common') },
      { find: '@components/report', replacement: path.resolve(__dirname, 'src/components/report') },
      { find: '@components/upload', replacement: path.resolve(__dirname, 'src/components/upload') },
      { find: '@components/user', replacement: path.resolve(__dirname, 'src/components/user') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },

      // 주요 디렉토리
      { find: '@features', replacement: path.resolve(__dirname, 'src/features') },
      { find: '@contexts', replacement: path.resolve(__dirname, 'src/contexts') },
      { find: '@api', replacement: path.resolve(__dirname, 'src/api') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: '@types', replacement: path.resolve(__dirname, 'src/types') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') },

      // fallback (항상 마지막)
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    // ✅ SPA 라우팅 대응 (404 방지)
    historyApiFallback: true,
  },
});
