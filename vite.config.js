// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   base: "/",
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
